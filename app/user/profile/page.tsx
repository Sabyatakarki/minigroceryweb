import { handleWhoAmI } from "@/lib/actions/auth-action";
import { notFound } from "next/navigation";
import UpdateUserForm from "../_components/updateprofile";


export default async function Page() {
    const result = await handleWhoAmI(new FormData());

    if (!result.success) {
        throw new Error("Error fetching user data");
    }

    if (!result.data) {
        notFound();
    }

    return (
        <div>
            <UpdateUserForm user={result.data} />
        </div>
    );
}