import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import NewsCard from '@/components/NewsCard';
import NotificationSettings from '@/components/NotificationSettings';
import AppSettings from '@/components/AppSettings';

const mockNews = [
  {
    id: 1,
    title: 'В Киржаче открылся новый детский сад на 150 мест',
    summary: 'Современное образовательное учреждение с игровыми площадками и спортивным залом приняло первых воспитанников.',
    content: 'Современное образовательное учреждение с игровыми площадками и спортивным залом приняло первых воспитанников. Детский сад оборудован по последним стандартам безопасности и включает медицинский кабинет, столовую и библиотеку. Строительство велось в рамках областной программы развития социальной инфраструктуры.',
    time: '2 часа назад',
    author: 'Анна Петрова',
    category: 'Образование',
    comments: [
      {
        id: 1,
        author: 'Мария',
        text: 'Отличная новость! Наконец-то решили проблему с нехваткой мест в детских садах.',
        time: '1 час назад'
      }
    ]
  },
  {
    id: 2,
    title: 'Ремонт дороги на улице Ленина завершится к концу месяца',
    summary: 'Подрядчики обещают закончить работы по асфальтированию и установке новых бордюров согласно графику.',
    content: 'Подрядчики обещают закончить работы по асфальтированию и установке новых бордюров согласно графику. Также планируется обновить дорожную разметку и установить дополнительные знаки. Общая протяженность отремонтированного участка составит 2,5 километра. Стоимость работ - 15 миллионов рублей.',
    time: '4 часа назад',
    author: 'Дмитрий Волков',
    category: 'Благоустройство',
    comments: [
      {
        id: 1,
        author: 'Александр',
        text: 'Надеемся, что качество будет хорошее, а не как в прошлый раз.',
        time: '3 часа назад'
      },
      {
        id: 2,
        author: 'Елена',
        text: 'Уже заметно улучшение! Спасибо администрации.',
        time: '2 часа назад'
      }
    ]
  },
  {
    id: 3,
    title: 'Городской парк готовится к празднованию Дня города',
    summary: 'В программе мероприятий концерты местных артистов, ярмарка мастеров и детские развлечения.',
    content: 'В программе мероприятий концерты местных артистов, ярмарка мастеров и детские развлечения. Планируется установка двух сцен для выступлений, торговых палаток и аттракционов. Праздник пройдет 25 сентября с 10:00 до 22:00. Ожидается участие более 5000 горожан.',
    time: '6 часов назад',
    author: 'Ольга Смирнова',
    category: 'События',
    comments: []
  },
  {
    id: 4,
    title: 'Местная футбольная команда одержала победу в областном чемпионате',
    summary: 'ФК "Киржач" обыграл соперников со счетом 3:1 и поднялся на второе место в турнирной таблице.',
    content: 'ФК "Киржач" обыграл соперников со счетом 3:1 и поднялся на второе место в турнирной таблице. Матч проходил на домашнем стадионе при поддержке 800 болельщиков. Голы забили Иванов, Петров и Сидоров. До конца сезона осталось 4 игры.',
    time: '8 часов назад',
    author: 'Сергей Козлов',
    category: 'Спорт',
    comments: [
      {
        id: 1,
        author: 'Болельщик',
        text: 'Молодцы ребята! Так держать!',
        time: '7 часов назад'
      }
    ]
  }
];

const categories = ['Все', 'Образование', 'Благоустройство', 'События', 'Спорт', 'Экономика'];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const filteredNews = mockNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Newspaper" size={18} className="text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">КиржачLive.ru</h1>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Icon name="Bell" size={16} className="mr-2" />
                    Уведомления
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <NotificationSettings />
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Icon name="Settings" size={16} className="mr-2" />
                    Настройки
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
                  <AppSettings />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск новостей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Новости не найдены</h3>
            <p className="text-muted-foreground">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {selectedCategory === 'Все' ? 'Все новости' : selectedCategory}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredNews.length} {filteredNews.length === 1 ? 'новость' : 'новостей'}
              </span>
            </div>

            <div className="space-y-4">
              {filteredNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline">
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Загрузить ещё
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="Newspaper" size={16} />
              <span>КиржачLive.ru</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Icon name="Mail" size={16} className="mr-1" />
                Контакты
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Icon name="MessageSquare" size={16} className="mr-1" />
                Telegram
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}