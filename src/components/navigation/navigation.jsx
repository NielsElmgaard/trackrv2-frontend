import {NavLink} from "react-router-dom";

function Navigation() {
    return (
        <nav className="main-nav">
            <ul>
                <li>
                    <NavLink
                        to="/Home"
                        end
                        className={({isActive}) => (isActive ? "active" : "")}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/Trackers"
                        end
                        className={({isActive}) => (isActive ? "active" : "")}
                    >
                        Trackers
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;