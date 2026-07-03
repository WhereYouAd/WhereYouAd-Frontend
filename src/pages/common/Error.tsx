import { memo } from "react";
import { useNavigate, useRouteError } from "react-router-dom";

import Button from "@/components/common/button/Button";
import ErrorLayout from "@/components/common/error/ErrorLayout";

const ErrorPage = memo(function ErrorPage() {
  const error = useRouteError() as { status?: number; message?: string } | null;
  const navigate = useNavigate();

  const is404 = error?.status === 404;
  const title = is404 ? "페이지를 찾을 수 없어요" : "오류가 발생했어요";
  const description = is404
    ? "요청하신 페이지가 존재하지 않거나\n주소가 변경되었을 수 있어요."
    : "일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.";

  return (
    <ErrorLayout
      title={title}
      description={description}
      actions={
        <>
          {!is404 && (
            <Button
              size="big"
              variant="primary"
              fullWidth
              onClick={() => window.location.reload()}
            >
              다시 시도
            </Button>
          )}
          <Button
            size="big"
            variant="secondary"
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

export default ErrorPage;
