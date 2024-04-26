import { useAuth0 } from "@auth0/auth0-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "./separator";
import { Button } from "./button";

const UsernameMenu = () => {
    
    const { user, logout} = useAuth0();

    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-green-500 gap-2">
                <CircleUserRound className="test-green-500" />
                {user?.email} 
             </DropdownMenuTrigger>
             <DropdownMenuContent>
                <DropdownMenuItem>
                <Link to="/user-profile" 
                className ="font-bold hover:text=green-500">
                    User Profile 
                </Link>
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem>
                    <Button 
                    onClick={() => logout()}
                    className ="flex flex-1 font-bold bg-green-500"
                    >
                        Log Out
                    </Button>
                </DropdownMenuItem>   
             </DropdownMenuContent>
        </DropdownMenu>

    );
};

export default UsernameMenu;