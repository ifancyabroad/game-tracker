import { Link } from "react-router";

export const Header: React.FC = () => {
	return (
		<header className="flex justify-between bg-white p-4 shadow">
			<h1 className="text-xl font-bold">Board Game Scores</h1>
			<nav className="flex gap-4">
				<Link to="/" className="hover:underline">
					Home
				</Link>
				<Link to="/players" className="hover:underline">
					Players
				</Link>
			</nav>
		</header>
	);
};
