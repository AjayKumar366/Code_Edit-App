import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/useAuth';

const Register = () => {
    const navigate = useNavigate();
    const {register} = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(username, email, password);
            navigate('/dashboard');
        }
        catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p>Register to access your account</p>
                {
                    error && <div className="error">{error}</div>
                }

                <form onSubmit={handleSubmit}>
                    <label>Username<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your Username" required /></label>
                    <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email" required /></label>
                    <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password" required /></label>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
