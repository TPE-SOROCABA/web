import { Breadcrumbs } from "@material-tailwind/react";
import { Loader } from "../loadder";
import { Link, useLocation } from "react-router-dom";
import { generateBreadcrumbs } from "../../utils/index";
import { HomeIcon } from "lucide-react";

interface BoxScreenProps {
  children: React.ReactNode;
  loader?: boolean;
  rightContent?: React.ReactNode;
  showBreadcrumbs?: boolean;
  background?: boolean;
}

export function BoxScreen({
  children,
  loader,
  rightContent,
  showBreadcrumbs,
  background = true,
}: BoxScreenProps) {
  const location = useLocation();
  return (
    <div className="h-full w-full m-4">
      <div className="flex w-full justify-between items-end py-2">
        {showBreadcrumbs && (
          <Breadcrumbs placeholder={showBreadcrumbs} separator=">">
            <Link to="/dashboard" title="Painel">
              <HomeIcon />
            </Link>
            {generateBreadcrumbs(location.pathname).map((breadcrumb, index) => {
              const isLast =
                index === generateBreadcrumbs(location.pathname).length - 1;
              return (
                <Link
                  key={breadcrumb.path}
                  to={breadcrumb.path}
                  title={breadcrumb.breadcrumbName}
                  className={`
                    ${
                      !isLast
                        ? "opacity-60 font-medium"
                        : "text-primary-600 font-bold"
                    }
                    hover:opacity-100 hover:underline
                  `}
                >
                  {breadcrumb.breadcrumbName}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}
        {rightContent}
      </div>
      <div
        className={`${
          background ? "bg-white" : "bg-none"
        } rounded-lg min-h-96 h-full flex flex-col gap-10 p-9 relative`}
      >
        {loader ? <Loader /> : children}
      </div>
    </div>
  );
}
