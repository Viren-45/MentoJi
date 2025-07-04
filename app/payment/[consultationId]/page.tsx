// app/payment/[consultationId]/page.tsx
import PaymentContainer from '@/components/payment/payment-container';

interface PaymentPageProps {
  params: {
    consultationId: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { consultationId } = params;

  return <PaymentContainer consultationId={consultationId} />;
}