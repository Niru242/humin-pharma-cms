import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('employees')
@Index('idx_employees_code', ['employeeCode'], { unique: true })
@Index('idx_employees_company', ['companyId'])
@Index('idx_employees_plant', ['plantId'])
@Index('idx_employees_department', ['departmentId'])
@Index('idx_employees_manager', ['reportingManagerId'])
@Index('idx_employees_status', ['employmentStatus'])
export class Employee extends BaseEntity {
  @Column({ type: 'varchar', length: 50, name: 'employee_code' })
  employeeCode: string; // Pay Code from legacy

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'avatar_url' })
  avatarUrl: string | null;

  // --- Employment ---
  @Column({ type: 'varchar', length: 200, nullable: true })
  designation: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'grade_id' })
  gradeId: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'company_id' })
  companyId: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'plant_id' })
  plantId: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'department_id' })
  departmentId: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'department_name' })
  departmentName: string | null; // Denormalized for list queries

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'reporting_manager_id' })
  reportingManagerId: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'reporting_manager_name' })
  reportingManagerName: string | null;

  @Column({ type: 'varchar', length: 20, default: 'Active', name: 'employment_status' })
  employmentStatus: string; // Active, On Leave, Probation, Notice, Separated, Suspended

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'employment_type' })
  employmentType: string | null; // Permanent, Contract, Trainee

  @Column({ type: 'date', nullable: true, name: 'date_of_joining' })
  dateOfJoining: string | null;

  @Column({ type: 'date', nullable: true, name: 'date_of_birth' })
  dateOfBirth: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string | null;

  @Column({ type: 'date', nullable: true, name: 'confirmation_date' })
  confirmationDate: string | null;

  @Column({ type: 'date', nullable: true, name: 'separation_date' })
  separationDate: string | null;

  // --- Sensitive (Restricted tier — masked by FieldAccessService) ---
  @Column({ type: 'varchar', length: 20, nullable: true, name: 'pan_number' })
  panNumber: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'aadhaar_number' })
  aadhaarNumber: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'bank_account_number' })
  bankAccountNumber: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'bank_ifsc' })
  bankIfsc: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'bank_name' })
  bankName: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'uan_number' })
  uanNumber: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true, name: 'esic_number' })
  esicNumber: string | null;

  // --- Address ---
  @Column({ type: 'text', nullable: true, name: 'current_address' })
  currentAddress: string | null;

  @Column({ type: 'text', nullable: true, name: 'permanent_address' })
  permanentAddress: string | null;

  // --- Emergency ---
  @Column({ type: 'varchar', length: 200, nullable: true, name: 'emergency_contact_name' })
  emergencyContactName: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'emergency_contact_phone' })
  emergencyContactPhone: string | null;

  // --- Link to User ---
  @Column({ type: 'varchar', length: 36, nullable: true, name: 'user_id' })
  userId: string | null;
}
