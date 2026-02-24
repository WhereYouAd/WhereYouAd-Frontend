import { useNavigate, useParams } from "react-router-dom";

export default function WorkspaceSetting() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  return <div>workspace settings</div>;
}
