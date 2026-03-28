import Card from "../../../components/Card";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import AppIcon from "../../../components/AppIcon";

const PortfolioTab = ({ myPortfolio, onGoToProfile }) => (
  <>
    <h3 className="font-bold text-lg mb-4">Portfolio Saya</h3>

    {myPortfolio.length === 0 ? (
      <Card className="p-6 text-center">
        <AppIcon name="image" size={32} className="mx-auto mb-2 text-gray-400" />
        <p className="text-gray-500 mb-3">Belum ada portfolio</p>
        <Button onClick={onGoToProfile}>Tambah Portfolio</Button>
      </Card>
    ) : (
      <div className="grid grid-cols-2 gap-3">
        {myPortfolio.map((item) => (
          <Card key={item.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all">
            <div
              className="w-full h-32 bg-gradient-to-br"
              style={{
                backgroundImage: item.image ? `url(${item.image})` : "none",
                backgroundColor: "#f3f4f6",
              }}
            />
            <div className="p-3">
              <p className="text-sm font-semibold text-slate-800 line-clamp-2">{item.title}</p>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              {item.beforeAfter && (
                <div className="mt-2">
                  <Badge color="#0284C7">Before-After</Badge>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    )}
  </>
);

export default PortfolioTab;
