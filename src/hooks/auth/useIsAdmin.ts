import useWorkspaceStore from "@/store/useWorkspaceStore";

/*useWorkspaceStore에서 myRole을 읽어서 booelan으로 반환하는 훅*/
function useIsAdmin(): boolean {
  const myRole = useWorkspaceStore((s) => s.myRole);
  return myRole === "ADMIN";
}

export default useIsAdmin;
