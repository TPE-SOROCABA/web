import { ImageFiles } from "../../../components";
import { BoxScreen } from "../../../components/box";
import { PetitionFormProvider } from "./store";
import { usePetitionFormStore } from "./store/useContextForm";
import { HandlerTabs } from "./Tabs";

export function FormularioPeticao() {
  return (
    <PetitionFormProvider>
      <BoxScreen showBreadcrumbs>
        <div className="grid grid-cols-3 gap-4">
          <HandlerTabs />
          <Files />
        </div>
      </BoxScreen>
    </PetitionFormProvider>
  );
}

const Files = () => {
  const { petition } = usePetitionFormStore();

  return (
    <ImageFiles
      contents={[
        petition?.pageOneUrl,
        petition?.pageTwoUrl,
        // petition?.pageOneUrl,
        // petition?.pageTwoUrl,
      ]}
    />
  );
};
