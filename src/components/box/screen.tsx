import { Breadcrumbs } from "@material-tailwind/react";
import { Loader } from "../loadder";
import { Link, useLocation } from "react-router-dom";
import { generateBreadcrumbs } from "../../utils/index";

interface BoxScreenProps {
  children: React.ReactNode;
  loader?: boolean;
  rightContent?: React.ReactNode;
  showBreadcrumbs?: boolean;
}

export function BoxScreen({
  children,
  loader,
  rightContent,
  showBreadcrumbs,
}: BoxScreenProps) {
  const location = useLocation();
  return (
    <div className="h-full w-full m-4">
      <div className="flex w-full justify-between items-center py-2">
        <Breadcrumbs placeholder>
          {showBreadcrumbs
            ? generateBreadcrumbs(location.pathname).map(
                (breadcrumb, index) => {
                  const isLast =
                    index === generateBreadcrumbs(location.pathname).length - 1;
                  return (
                    <Link
                      key={breadcrumb.path}
                      to={breadcrumb.path}
                      className={`${!isLast ? "opacity-60" : ""}`}
                    >
                      {breadcrumb.breadcrumbName}
                    </Link>
                  );
                }
              )
            : null}
        </Breadcrumbs>
        {rightContent}
      </div>
      <div className="bg-white rounded-lg min-h-full flex flex-col gap-10 p-9">
        {loader ? <Loader /> : children}
      </div>
    </div>
  );
}
