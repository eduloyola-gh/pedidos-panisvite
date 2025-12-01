import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOrderConfirmationEmail = async (order: any, items: any[]) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP credentials not configured. Skipping email.');
        return;
    }

    const customerEmail = order.user?.email || JSON.parse(order.guestInfo || '{}').email;
    const customerName = order.user?.name || JSON.parse(order.guestInfo || '{}').name || 'Cliente';

    if (!customerEmail) return;

    const itemsList = items.map(item =>
        `<li>${item.quantity}x ${item.name} - ${(item.price * item.quantity).toFixed(2)}€</li>`
    ).join('');

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #d97706;">¡Gracias por tu pedido!</h1>
      <p>Hola ${customerName},</p>
      <p>Hemos recibido tu pedido correctamente. Aquí tienes los detalles:</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Pedido #${order.id.slice(-6)}</h3>
        <p><strong>Fecha de entrega:</strong> ${new Date(order.deliveryDate).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ${order.total.toFixed(2)}€</p>
        
        <h4>Productos:</h4>
        <ul>
          ${itemsList}
        </ul>
      </div>
      
      <p>Si tienes alguna duda, puedes contactarnos respondiendo a este correo.</p>
      <p>¡Gracias por confiar en PanIsVite!</p>
    </div>
  `;

    try {
        await transporter.sendMail({
            from: `"PanIsVite" <${process.env.SMTP_USER}>`,
            to: customerEmail,
            subject: `Confirmación de Pedido #${order.id.slice(-6)} - PanIsVite`,
            html,
        });
        console.log(`Email sent to ${customerEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
