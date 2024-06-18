import CreatePin from "@/components/auth/create-pin";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface PinButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const PinButton = ({
  children,
  mode = "redirect",
  asChild,
}: PinButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    console.log("Login Button Clicked");
    // router.push("/");
  };
  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <CreatePin />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <span onClick={onClick} className="cursor-pointer">
        {children}
      </span>
    </>
  );
};

export default PinButton;
