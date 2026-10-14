import { requireOwner, json, apiError } from '@/lib/auth';
import { employeeRecords, publicEmployee, enrollEmployee, removeEmployee } from '@/lib/employees';
import { readJson, onlyKeys, string } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try { await requireOwner(request); return json({ employees: (await employeeRecords()).map(publicEmployee) }); }
  catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    await requireOwner(request);
    const input = await readJson(request, 8192);
    onlyKeys(input, ['name', 'email', 'password']);
    string(input.password, 'password', 1024, true);
    return json({ employee: await enrollEmployee(string(input.name, 'name', 120, true), string(input.email, 'email', 254, true), input.password as string) }, 201);
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request) {
  try {
    await requireOwner(request);
    const input = await readJson(request, 2048);
    onlyKeys(input, ['id']);
    return json({ employee: await removeEmployee(string(input.id, 'id', 100, true)) });
  } catch (error) { return apiError(error); }
}
