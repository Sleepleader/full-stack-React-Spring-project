import './index.css';

const ContactAmazon: React.FC = () => {
  return (
    <main className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <header className="contact-header">
          <h1>Contact Amazon</h1>
        </header>

        <hr className="contact-divider" />

        {/* Section 1: Sales & Product Inquiries */}
        <section className="contact-section">
          <h2>Sales &amp; Product Inquiries</h2>

          <h3>Amazon Online Store</h3>

          <p>
            Visit the Amazon Online Store to purchase Amazon hardware, software,
            and third-party accessories. To make a purchase by phone, please call{' '}
            <strong>400-666-8800</strong>.
          </p>

          <p>
            To check the latest status and modify your Amazon Online Store order,
            please visit the{' '}
            <a href="/orders" className="contact-link">
              Online Order Status page
            </a>
            . You may also contact Amazon Customer Service by calling{' '}
            <strong>400-666-8800</strong>, or visit{' '}
            <a href="/account" className="contact-link">
              Online Help
            </a>{' '}
            for more information.
          </p>
        </section>

        <hr className="contact-divider" />

        {/* Section 2: Product & Service Support */}
        <section className="contact-section">
          <h2>Product &amp; Service Support</h2>

          <h3>Contact Amazon Support for Help</h3>

          <p>
            Need service or support? Let us know the details, and we will provide
            the ideal solution. You can contact us by phone, online chat, or find
            answers online.
          </p>
        </section>
      </div>
    </main>
  );
};

export default ContactAmazon;
