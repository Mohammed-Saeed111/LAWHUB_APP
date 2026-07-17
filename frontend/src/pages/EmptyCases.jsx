import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFileText, FiFolder } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';

/**
 * SCREEN 9 — Empty State: No Active Cases.
 * Encouraging welcome message with a luxury gold illustration and quick
 * actions ("Find a lawyer" / "Browse ready-made contracts") to onboard the user.
 */
const EmptyCases = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-gold" />
        <h1 className="section-title">قضاياي القانونية</h1>
      </div>
      <div className="card-luxury">
        <EmptyState icon={FiFolder} title="لا توجد قضايا نشطة بعد"
          description="ابدأ رحلتك القانونية مع محاميك — اعثر على المحامي المناسب أو تصفّح العقود الجاهزة للاستخدام الفوري.">
          <button onClick={() => navigate('/search')} className="btn-gold"><FiSearch /> البحث عن محامٍ</button>
          <button onClick={() => navigate('/')} className="btn-outline"><FiFileText /> تصفّح العقود الجاهزة</button>
        </EmptyState>
      </div>
    </div>
  );
};
export default EmptyCases;
