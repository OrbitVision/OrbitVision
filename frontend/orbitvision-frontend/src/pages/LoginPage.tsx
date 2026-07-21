import { useState, type FormEvent } from 'react';
import universeBackground from '../assets/Universe_Background.jpg';
import { useAuth } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogging, setIsLogging] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (username.trim() === '') {
            setError('Proszę podać nazwę użytkownika.');
            return;
        }

        if (password.trim() === '') {
            setError('Proszę podać hasło.');
            return;
        }

        if (password.length < 6) {
            setError('Hasło musi zawierać co najmniej 6 znaków.');
            return;
        }

        try {
            setIsLogging(true);
            await login(username, password);
            navigate('/satellites');
        } catch (error) {
            console.error(error);
            setError('Nieprawidłowa nazwa użytkownika lub hasło.');
        } finally {
            setIsLogging(false);
        }


    };

    return (
        <main className="flex min-h-screen items-center justify-center px-4" style={{ backgroundImage: `url(${universeBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl opacity-90">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Logowanie
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Zaloguj się do swojego konta
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="username"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Nazwa użytkownika
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Nazwa użytkownika"
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Hasło
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Minimum 6 znaków"
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-500/50"
                        disabled={isLogging} 
                    >
                        {isLogging ? 'Logowanie...' : 'Zaloguj się'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Nie masz jeszcze konta?

                    <Link to="/register" className="ml-2 font-semibold text-blue-400 hover:text-blue-300">
                        Zarejestruj się
                    </Link>
                </p>
            </div>
        </main>

    )
}