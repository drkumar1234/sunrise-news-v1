export interface StaffInput {
  name: string;
  idNumber: string;
  age: number;
  fatherName: string;
  designation: string;
  experience: string;
  accreditationNumber: string;
  dateOfJoining: string;
  photoUrl: string;
  joiningLetterUrl: string;
}
export interface StaffMember extends StaffInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
