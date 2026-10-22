function Footer() {

    return (
        <footer className="footer">

            <div className="footer-brand">

                <h2>OOPSIBID</h2>

                <p>
                    The next generation auction platform.
                </p>

            </div>


            <div className="footer-links">

                <div>
                    <h4>Platform</h4>
                    <a href="/auctions">Auctions</a>
                    <a href="/categories">Categories</a>
                    <a href="/sell">Sell</a>
                </div>

                <div>
                    <h4>Company</h4>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/help">Help</a>
                </div>

                <div>
                    <h4>Legal</h4>
                    <a href="/terms">Terms</a>
                    <a href="/privacy">Privacy</a>
                </div>

            </div>


            <div className="footer-bottom">

                © 2026 OOPSIBID. All rights reserved.

            </div>

        </footer>
    );
}

export default Footer;