import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Expert() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Link href="/expert/apply">
                <Button className="cursor-pointer">Apply as an Expert</Button>
            </Link>
        </div>
    )
}