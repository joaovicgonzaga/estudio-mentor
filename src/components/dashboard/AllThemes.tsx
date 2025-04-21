
interface ThemeData {
  id: string | number;
  title: string;
  description?: string;
  progress: number;
  questionsCount: number;
  correctAnswers: number;
}

interface AllThemesProps {
  themes: ThemeData[];
  ThemeCard: React.ComponentType<ThemeData>;
}

export const AllThemes = ({ themes, ThemeCard }: AllThemesProps) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Todos os Temas
        </h2>
        <p className="text-sm text-gray-600">
          Continue de onde parou ou explore novos temas
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {themes.map((theme) => (
          <ThemeCard key={theme.id} {...theme} />
        ))}
        {themes.length === 0 && (
          <p className="text-sm text-gray-500 col-span-full">Nenhum tema disponível</p>
        )}
      </div>
    </div>
  );
};
