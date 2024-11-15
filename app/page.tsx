"use client"
import AppContainer from '@/components/ui/AppContainer';

interface FormData {
  // Add your form fields here
  name: string;
  email: string;
  // ... other fields
}

export default function Page() {
  const handleSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <AppContainer onSubmit={handleSubmit} />
  );
}