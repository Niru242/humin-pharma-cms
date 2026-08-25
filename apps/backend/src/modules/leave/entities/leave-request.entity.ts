import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('leave_requests')
@Index('idx_leave_req_employee', ['employeeId'])
@Index('idx_leave_req_status', ['status'])
@Index('idx_leave_req_dates', ['startDate', 'endDate'])
export class LeaveRequest extends BaseEntity {
  @Column({ type: 'varchar', length: 36, name: 'employee_id' })
  employeeId: string;

  @Column({ type: 'varchar', length: 50, name: 'employee_code' })
  employeeCode: string;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'employee_name' })
  employeeName: string | null;

  @Column({ type: 'varchar', length: 36, name: 'leave_type_id' })
  leaveTypeId: string;

  @Column({ type: 'varchar', length: 50, name: 'leave_type_code' })
  leaveTypeCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'leave_type_name' })
  leaveTypeName: string | null;

  @Column({ type: 'date', name: 'start_date' })
  startDate: string;

  @Column({ type: 'date', name: 'end_date' })
  endDate: string;

  @Column({ type: 'decimal', precision: 4, scale: 1, name: 'total_days' })
  totalDays: number;

  @Column({ type: 'varchar', length: 20, default: 'full_day', name: 'day_part' })
  dayPart: string; // 'full_day', 'first_half', 'second_half'

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  /**
   * Status (Section 7):
   * Draft → Pending Approval → Approved/Rejected → Cancellation Pending → Cancelled
   */
  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'approver_id' })
  approverId: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'approver_name' })
  approverName: string | null;

  @Column({ type: 'datetime', nullable: true, name: 'approved_at' })
  approvedAt: Date | null;

  @Column({ type: 'text', nullable: true, name: 'approver_comment' })
  approverComment: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'workflow_instance_id' })
  workflowInstanceId: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'document_id' })
  documentId: string | null; // Attached supporting document

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'department_id' })
  departmentId: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'plant_id' })
  plantId: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true, name: 'company_id' })
  companyId: string | null;
}
