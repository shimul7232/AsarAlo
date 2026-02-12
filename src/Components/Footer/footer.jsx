
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {

    return(
        <>
            <section className='footer-container'>
                <div className="copyright">© 2024 MedCare. All rights reserved.</div>
                <div className='footer-links'>
                    <ul>
                        <Link to="/about">About Us</Link>
                    </ul>
                </div>
                <div className="social-links">

                </div>
            </section>
        
        </>
    )
}