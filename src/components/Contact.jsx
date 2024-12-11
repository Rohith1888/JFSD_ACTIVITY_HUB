import React, { useState } from "react";
import axios from "axios";  // Import axios
import "../components/css/contact.css"; // Assuming your CSS file is named Contact.css
import { toast, ToastContainer } from "react-toastify";
import BouncingDotsLoader from "./BouncingDotsLoader";



export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);  // Loading state for submit button
    const [error, setError] = useState('');  // Error state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submission starts
        setError(''); // Reset previous error message

        // Send the form data to the backend using Axios
        axios.post("https://jfsdactivityhubbackend-production.up.railway.app/student/sendContactMessage", formData)
            .then((response) => {
                // Assuming the backend returns a success message
                setLoading(false); // Stop loading
                toast.success('Your message has been sent successfully!'); // Show success toast
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                });
            })
            .catch((error) => {
                setLoading(false); // Stop loading
                setError("There was an error sending your message. Please try again."); // Set error message
                console.error(error);
            });
    };

    return (
        <>
        <ToastContainer />
        <div className="contact-page">
            <div className="contact-container">
                <div className="form-section">
                    <h1 className="contact-title">Get In Touch</h1>
                    <h3 className="contact-subtitle">Leave us a message</h3>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="First Name & Last Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Your Message</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Write your message here..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <div className="error-message">{error}</div>} {/* Display error message */}
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? <BouncingDotsLoader /> : 'Send'} {/* Show loading or send button */}
                        </button>
                    </form>
                </div>

                {/* Right side: Contact information */}
                <div className="info-section">
                    <div className="contact-info">
                        <h3>Contact Info</h3>
                        <p><strong>Address:</strong> Activity Hub, KL University, Vaddeswaram, Green Fields</p>
                        <p><strong>Phone:</strong> +91 9999999999</p>
                        <p><strong>Email:</strong> activityhub@gmail.com</p>
                    </div>
                    <div className="map-container">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.6644981422487!2d80.62035802487615!3d16.441857079355156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0a2a073957d%3A0xe79d66babc83e470!2sK%20L%20UNIVERSITY%2C%20Vaddeswaram%2C%20Andhra%20Pradesh%20522303!5e0!3m2!1sen!2sin!4v1731948418437!5m2!1sen!2sin"
                            width="400"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Map"
                        ></iframe>
                    </div>
                </div>
            </div>
            
        </div>
        </>
    );
}
