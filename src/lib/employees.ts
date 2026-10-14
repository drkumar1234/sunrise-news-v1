import 'server-only';
import { randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { readJSON, mutateJSON } from './storage';
import { ApiError } from './auth';

const derive = promisify(scrypt);
export type Employee = { id: string; name: string; email: string; role: 'editor'; createdAt: string; removedAt?: string; salt: string; passwordHash: string };
type Registry = { employees: Employee[] };
const empty = (): Registry => ({ employees: [] });
export async function employeeRecords() { return (await readJSON('sunrise-auth', 'employees-v1', empty)).employees; }
export function publicEmployee({ salt, passwordHash, ...employee }: Employee) { return employee; }
export async function enrollEmployee(name: string, email: string, password: string) {
  if (!name.trim() || name.length > 120) throw new ApiError(400, 'Enter an employee name (up to 120 characters).');
  email = email.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(400, 'Enter a valid email address.');
  if (email === process.env.ADMIN_EMAIL?.trim().toLowerCase()) throw new ApiError(409, 'The owner email cannot be enrolled as an employee.');
  if (password.length < 12 || password.length > 1024 || !password.trim()) throw new ApiError(400, 'Use a password between 12 and 1024 characters.');
  const salt = randomBytes(32).toString('hex');
  const passwordHash = (await derive(password, salt, 64) as Buffer).toString('hex');
  const employee: Employee = { id: `employee-${randomUUID()}`, name: name.trim(), email, role: 'editor', createdAt: new Date().toISOString(), salt, passwordHash };
  return mutateJSON('sunrise-auth', 'employees-v1', empty, data => {
    if (data.employees.some(item => !item.removedAt && item.email === email)) throw new ApiError(409, 'An active employee already uses that email.');
    data.employees.push(employee);
    return publicEmployee(employee);
  });
}
export async function removeEmployee(id: string) {
  return mutateJSON('sunrise-auth', 'employees-v1', empty, data => {
    const employee = data.employees.find(item => item.id === id);
    if (!employee) throw new ApiError(404, 'Employee not found.');
    employee.removedAt ||= new Date().toISOString();
    return publicEmployee(employee);
  });
}
export async function authenticateEmployee(email: string, password: string) {
  const employee = (await employeeRecords()).find(item => !item.removedAt && item.email === email.trim().toLowerCase());
  // Always run the same password derivation for unknown accounts as well.
  const hash = await derive(password, employee?.salt || '0'.repeat(64), 64) as Buffer;
  const expected = Buffer.from(employee?.passwordHash || '0'.repeat(128), 'hex');
  return timingSafeEqual(hash, expected) && employee ? employee : null;
}
