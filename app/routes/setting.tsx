import { stackRouterBack } from "@/utils/helper/app";
import { useNavigate } from "@remix-run/react";

export default function Setting() {
  const navigate = useNavigate();
  return (
    <div>
      setting page soon...
      <button onClick={() => stackRouterBack(navigate)}>go back</button>
    </div>
  );
}
