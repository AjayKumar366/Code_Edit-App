import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            await login(email, password);
            navigate('/dashboard');
        }catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Welcome Back</h1>
                <p>Login to your account</p>
                {
                    error && <div className="error">{error}</div>
                }

                <form onSubmit={handleSubmit}>
                    <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email" required /></label>
                    <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password" required /></label>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;
