import Header from "@/components/Header";
import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
    return (
        <>
            <Header />
            <main className="container" style={{ paddingBottom: '4rem' }}>
                <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Finalizar Pedido</h2>
                <CheckoutForm />
            </main>
        </>
    );
}
