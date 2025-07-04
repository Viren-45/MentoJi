// app/expert/dashboard/payment-setup/page.tsx
import PaymentSetupLayout from "@/components/expert/dashboard/payment-setup/payment-setup-layout";
import StripeConnectionCard from "@/components/expert/dashboard/payment-setup/stripe-connection-card";

const PaymentSetupPage = () => {
  return (
    <PaymentSetupLayout>
      <StripeConnectionCard />
    </PaymentSetupLayout>
  );
};

export default PaymentSetupPage;