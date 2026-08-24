'use client';

import { useParams } from 'next/navigation';
import EmployeeProfileView from '../components/EmployeeProfileView';

export default function Employee360Page() {
  const params = useParams();
  
  return <EmployeeProfileView employeeId={params.id} />;
}
