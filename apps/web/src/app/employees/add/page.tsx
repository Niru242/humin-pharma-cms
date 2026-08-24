'use client';

import { useRouter } from 'next/navigation';
import AddEmployeeForm from '../components/AddEmployeeForm';

export default function AddEmployeeWizardPage() {
  const router = useRouter();
  
  return (
    <AddEmployeeForm onComplete={() => router.push('/employees')} />
  );
}
