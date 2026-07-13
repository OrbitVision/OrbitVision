import { useState, type FormEvent } from "react";
import universeBackground from "../assets/Universe_Background.jpg";
import { Link, useNavigate } from "react-router-dom";
import { axiosRegister } from "../api/axios";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (username.trim() === "") {
            setError("Proszę podać nazwę użytkownika.");
            return;
        }

        if (email.trim() === "") {
            setError("Proszę podać adres e-mail.");
            return;
        }

        if (password.trim() === "") {
            setError("Proszę podać hasło.");
            return;
        }

        if (password.length < 6) {
            setError("Hasło musi zawierać co najmniej 6 znaków.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Hasła nie są identyczne.");
            return;
        }

        try {
            console.log("Rejestracja:", {
                username,
                email,
                password,
            });

            const user = await axiosRegister(username, email, password);

            console.log(user);

            navigate("/login");
            
        } catch (error) {
            console.error(error);
            setError("Nie udało się utworzyć konta.");
        }
    };

    return (
        <main
            className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4"
            style={{
                backgroundImage: `url(${universeBackground})`,
            }}
        >
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Rejestracja
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Utwórz nowe konto
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
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nazwa użytkownika"
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Adres e-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
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
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimum 6 znaków"
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Powtórz hasło
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Powtórz hasło"
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
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
                    >
                        Utwórz konto
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Masz już konto?

                    <Link
                        to="/login"
                        className="ml-2 font-semibold text-blue-400 hover:text-blue-300"
                    >
                        Zaloguj się
                    </Link>
                </p>
            </div>
        </main>
    );
}