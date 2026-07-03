import { memo } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/common/button/Button";
import ErrorLayout from "@/components/common/error/ErrorLayout";

const NotFound = memo(function NotFound() {
  const navigate = useNavigate();

  return (
    <ErrorLayout
      title="페이지를 찾을 수 없어요"
      description={
        "요청하신 페이지가 존재하지 않거나\n주소가 변경되었을 수 있어요."
      }
      actions={
        <>
          <Button
            size="big"
            variant="secondary"
            fullWidth
            onClick={() => navigate(-1)}
          >
            이전 페이지로
          </Button>
          <Button
            size="big"
            variant="primary"
            fullWidth
            onClick={() => navigate("/", { replace: true })}
          >
            홈으로 이동
          </Button>
        </>
      }
    />
  );
});

export default NotFound;
