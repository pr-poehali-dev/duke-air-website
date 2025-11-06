import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

interface Flight {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  price: number;
  aircraft: string;
  duration: string;
}

interface Booking {
  id: string;
  flight: Flight;
  passengers: number;
  class: string;
  seat?: string;
  status: string;
}

const Index = () => {
  const [tripType, setTripType] = useState('round-trip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('economy');
  const [activeTab, setActiveTab] = useState('home');
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingCode, setBookingCode] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isConfirmPaymentOpen, setIsConfirmPaymentOpen] = useState(false);
  const [selectedBookingForInfo, setSelectedBookingForInfo] = useState<Booking | null>(null);

  const popularDestinations = [
    { city: 'Дубай', country: 'ОАЭ', price: 'от 25 000 ₽', image: 'https://cdn.poehali.dev/projects/e1447cea-fea6-40d1-be4c-7de588bd55c1/files/45e4e2df-14ba-492e-9523-a72140c7e751.jpg' },
    { city: 'Париж', country: 'Франция', price: 'от 18 000 ₽', image: 'https://cdn.poehali.dev/projects/e1447cea-fea6-40d1-be4c-7de588bd55c1/files/6ae57607-23fa-4dce-9950-22c78220f68f.jpg' },
    { city: 'Токио', country: 'Япония', price: 'от 35 000 ₽', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop' },
  ];

  const allFlights: Flight[] = [
    { id: '1', from: 'Москва (DME)', to: 'Дубай (DXB)', departure: '10:30', arrival: '17:45', price: 25000, aircraft: 'Boeing 777', duration: '5ч 15м' },
    { id: '2', from: 'Москва (DME)', to: 'Дубай (DXB)', departure: '14:20', arrival: '21:35', price: 22500, aircraft: 'Airbus A320', duration: '5ч 15м' },
    { id: '3', from: 'Москва (DME)', to: 'Париж (CDG)', departure: '08:00', arrival: '11:30', price: 18000, aircraft: 'Boeing 737', duration: '4ч 30м' },
    { id: '4', from: 'Москва (DME)', to: 'Париж (CDG)', departure: '16:15', arrival: '19:45', price: 19500, aircraft: 'Airbus A320', duration: '4ч 30м' },
    { id: '5', from: 'Москва (DME)', to: 'Токио (NRT)', departure: '12:00', arrival: '04:30', price: 35000, aircraft: 'Boeing 777', duration: '9ч 30м' },
    { id: '6', from: 'Москва (DME)', to: 'Токио (NRT)', departure: '20:45', arrival: '13:15', price: 33000, aircraft: 'Boeing 787', duration: '9ч 30м' },
    { id: '7', from: 'Санкт-Петербург (LED)', to: 'Дубай (DXB)', departure: '09:00', arrival: '16:15', price: 27000, aircraft: 'Airbus A320', duration: '5ч 15м' },
    { id: '8', from: 'Санкт-Петербург (LED)', to: 'Париж (CDG)', departure: '11:30', arrival: '14:45', price: 20000, aircraft: 'Boeing 737', duration: '4ч 15м' },
    { id: '9', from: 'Дубай (DXB)', to: 'Москва (DME)', departure: '18:30', arrival: '23:00', price: 24000, aircraft: 'Boeing 777', duration: '5ч 30м' },
    { id: '10', from: 'Париж (CDG)', to: 'Москва (DME)', departure: '13:00', arrival: '18:15', price: 17500, aircraft: 'Airbus A320', duration: '4ч 15м' }
  ];

  const handleSearch = () => {
    if (!from || !to || !departDate) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    
    const results = allFlights.filter(flight => {
      const fromMatch = flight.from.toLowerCase().includes(from.toLowerCase());
      const toMatch = flight.to.toLowerCase().includes(to.toLowerCase());
      return fromMatch && toMatch;
    });
    
    if (results.length === 0) {
      toast.error('Рейсы не найдены. Попробуйте другие города.');
      return;
    }
    
    setSearchResults(results);
    setActiveTab('search');
    toast.success('Найдено рейсов: ' + results.length);
  };

  const handleBookFlight = (flight: Flight) => {
    setSelectedFlight(flight);
  };

  const confirmBooking = () => {
    if (!selectedFlight || !selectedSeat) {
      toast.error('Выберите место в самолёте');
      return;
    }

    const newBooking: Booking = {
      id: 'DA' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      flight: selectedFlight,
      passengers,
      class: travelClass,
      seat: selectedSeat,
      status: 'pending'
    };

    setBookings([...bookings, newBooking]);
    toast.success(`Бронирование создано! Код: ${newBooking.id}`);
    setSelectedFlight(null);
    setSelectedSeat(null);
    setIsPaymentOpen(true);
  };

  const handleLogin = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Введите корректный номер телефона');
      return;
    }
    setIsLoggedIn(true);
    setUserName(phoneNumber);
    setIsLoginOpen(false);
    toast.success('Вы вошли в аккаунт!');
  };

  const handlePayment = () => {
    setIsPaymentOpen(false);
    setIsConfirmPaymentOpen(true);
  };

  const confirmPayment = () => {
    const lastBooking = bookings[bookings.length - 1];
    if (lastBooking) {
      const updatedBookings = [...bookings];
      updatedBookings[updatedBookings.length - 1] = {
        ...lastBooking,
        status: 'paid'
      };
      setBookings(updatedBookings);
    }
    setIsConfirmPaymentOpen(false);
    toast.success('Оплата прошла успешно! Билет куплен.');
    setActiveTab('mybooking');
  };

  const handleRefund = (bookingId: string) => {
    const updatedBookings = bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'refunded' } : b
    );
    setBookings(updatedBookings);
    toast.success('Билет возвращён. Деньги будут возвращены в течение 5-7 дней.');
  };

  const renderSeatMap = () => {
    const rows = 20;
    const seatsPerRow = 6;
    const seats = [];
    
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatLetter = String.fromCharCode(65 + seat);
        const seatId = `${row}${seatLetter}`;
        const isOccupied = Math.random() > 0.7;
        const isPremium = row <= 3;
        
        rowSeats.push(
          <button
            key={seatId}
            onClick={() => !isOccupied && setSelectedSeat(seatId)}
            disabled={isOccupied}
            className={`w-10 h-10 m-1 rounded-md text-xs font-medium transition-all ${
              isOccupied
                ? 'bg-gray-300 cursor-not-allowed'
                : selectedSeat === seatId
                ? 'bg-accent text-accent-foreground ring-2 ring-accent'
                : isPremium
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-900'
                : 'bg-green-100 hover:bg-green-200 text-green-900'
            }`}
          >
            {seatId}
          </button>
        );
        if (seat === 2) {
          rowSeats.push(<div key={`aisle-${row}`} className="w-6" />);
        }
      }
      seats.push(
        <div key={row} className="flex justify-center items-center">
          <span className="w-8 text-sm text-muted-foreground">{row}</span>
          {rowSeats}
        </div>
      );
    }
    return seats;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Plane" size={32} className="text-accent" />
              <h1 className="text-2xl md:text-3xl font-bold">Duke Air</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setActiveTab('home')}
                className={`hover:text-accent transition-colors ${activeTab === 'home' ? 'text-accent' : ''}`}
              >
                Главная
              </button>
              <button
                onClick={() => setActiveTab('mybooking')}
                className={`hover:text-accent transition-colors ${activeTab === 'mybooking' ? 'text-accent' : ''}`}
              >
                Моё бронирование
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`hover:text-accent transition-colors ${activeTab === 'reviews' ? 'text-accent' : ''}`}
              >
                Отзывы
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`hover:text-accent transition-colors ${activeTab === 'about' ? 'text-accent' : ''}`}
              >
                О компании
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/90">
                RU
              </Button>
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Icon name="User" size={16} className="text-accent" />
                  <span className="text-sm">{userName}</span>
                </div>
              ) : (
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <Icon name="User" size={16} className="mr-1" />
                      Вход
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход в аккаунт</DialogTitle>
                      <DialogDescription>Введите номер телефона для входа</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Номер телефона</Label>
                        <Input
                          type="tel"
                          placeholder="+7 (900) 123-45-67"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <Button onClick={handleLogin} className="w-full bg-accent hover:bg-accent/90">
                        Войти
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      {activeTab === 'home' && (
        <>
          <section
            className="relative h-[600px] bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(rgba(30, 64, 175, 0.5), rgba(30, 64, 175, 0.7)), url('https://cdn.poehali.dev/projects/e1447cea-fea6-40d1-be4c-7de588bd55c1/files/2f352268-b755-4505-b064-246d4137f5a9.jpg')`
            }}
          >
            <div className="container mx-auto px-4 text-center text-white animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold mb-4">Duke Air</h2>
              <p className="text-xl md:text-2xl mb-8">Мы соединяем континенты</p>
            </div>
          </section>

          <section className="container mx-auto px-4 -mt-20 relative z-10">
            <Card className="shadow-2xl animate-slide-up">
              <CardHeader>
                <CardTitle className="text-2xl">Поиск и бронирование билетов</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={tripType} onValueChange={setTripType} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="round-trip" id="round-trip" />
                    <Label htmlFor="round-trip">Туда и обратно</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-way" id="one-way" />
                    <Label htmlFor="one-way">В одну сторону</Label>
                  </div>
                </RadioGroup>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Откуда</Label>
                    <Input
                      placeholder="Москва"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Куда</Label>
                    <Input
                      placeholder="Дубай"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Дата вылета</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left mt-1"
                        >
                          <Icon name="Calendar" size={16} className="mr-2" />
                          {departDate ? format(departDate, 'PPP', { locale: ru }) : 'Выберите дату'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={departDate}
                          onSelect={setDepartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {tripType === 'round-trip' && (
                    <div>
                      <Label>Дата возвращения</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left mt-1"
                          >
                            <Icon name="Calendar" size={16} className="mr-2" />
                            {returnDate ? format(returnDate, 'PPP', { locale: ru }) : 'Выберите дату'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={returnDate}
                            onSelect={setReturnDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Пассажиры</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                      >
                        <Icon name="Minus" size={16} />
                      </Button>
                      <Input
                        type="number"
                        value={passengers}
                        readOnly
                        className="text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPassengers(Math.min(9, passengers + 1))}
                      >
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Класс обслуживания</Label>
                    <Select value={travelClass} onValueChange={setTravelClass}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Эконом</SelectItem>
                        <SelectItem value="business">Бизнес</SelectItem>
                        <SelectItem value="first">Первый класс</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSearch} className="w-full text-lg py-6 bg-accent hover:bg-accent/90">
                  <Icon name="Search" size={20} className="mr-2" />
                  Найти рейсы
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="container mx-auto px-4 py-16">
            <h3 className="text-3xl font-bold text-center mb-8">Популярные направления</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {popularDestinations.map((dest) => (
                <Card key={dest.city} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.city}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-accent">{dest.price}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle>{dest.city}</CardTitle>
                    <CardDescription>{dest.country}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </section>

          <section className="bg-primary/5 py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-3xl font-bold text-center mb-12">Почему Duke Air?</h3>
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { icon: 'Shield', title: 'Безопасность', desc: 'Современный флот с высочайшими стандартами' },
                  { icon: 'Clock', title: 'Пунктуальность', desc: '98% рейсов вовремя' },
                  { icon: 'Heart', title: 'Комфорт', desc: 'Премиальный сервис в каждом классе' },
                  { icon: 'Globe', title: 'Сеть маршрутов', desc: 'Полёты в 150+ городов мира' }
                ].map((feature) => (
                  <div key={feature.title} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Icon name={feature.icon as any} size={32} className="text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'search' && (
        <section className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => setActiveTab('home')} className="mb-4">
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад к поиску
          </Button>
          
          <h2 className="text-3xl font-bold mb-6">Доступные рейсы</h2>
          
          <div className="space-y-4">
            {searchResults.map((flight) => (
              <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{flight.departure}</div>
                          <div className="text-sm text-muted-foreground">{flight.from}</div>
                        </div>
                        
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center">
                            <Icon name="Plane" size={20} className="text-primary mx-auto mb-1" />
                            <div className="text-sm text-muted-foreground">{flight.duration}</div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold">{flight.arrival}</div>
                          <div className="text-sm text-muted-foreground">{flight.to}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Plane" size={14} />
                        <span>{flight.aircraft}</span>
                      </div>
                    </div>
                    
                    <div className="text-center md:text-right">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {flight.price.toLocaleString('ru-RU')} ₽
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => handleBookFlight(flight)} className="bg-accent hover:bg-accent/90">
                            Выбрать
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Выбор места в самолёте</DialogTitle>
                            <DialogDescription>
                              {flight.from} → {flight.to} | {flight.aircraft}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="flex gap-6 justify-center text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-100 rounded"></div>
                                <span>Свободно</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 rounded"></div>
                                <span>Премиум (ряды 1-3)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                                <span>Занято</span>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
                              <div className="space-y-1 min-w-max">
                                {renderSeatMap()}
                              </div>
                            </div>

                            {selectedSeat && (
                              <div className="bg-primary/10 p-4 rounded-lg">
                                <p className="text-center font-semibold">
                                  Выбрано место: <span className="text-primary text-lg">{selectedSeat}</span>
                                </p>
                              </div>
                            )}

                            <Button
                              onClick={confirmBooking}
                              disabled={!selectedSeat}
                              className="w-full bg-accent hover:bg-accent/90"
                            >
                              Подтвердить бронирование
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'mybooking' && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Моё бронирование</h2>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Найти бронирование</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Введите код бронирования (например: DA1A2B3C)"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                />
                <Button>Найти</Button>
              </div>
            </CardContent>
          </Card>

          {bookings.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Мои бронирования</h3>
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className={`mb-2 ${booking.status === 'paid' ? 'bg-green-500' : booking.status === 'refunded' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                          {booking.status === 'paid' ? 'Оплачено' : booking.status === 'refunded' ? 'Возвращено' : 'Ожидает оплаты'}
                        </Badge>
                        <h4 className="text-xl font-bold">Код: {booking.id}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {booking.flight.price.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Маршрут</div>
                        <div className="font-semibold">{booking.flight.from} → {booking.flight.to}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Время вылета</div>
                        <div className="font-semibold">{booking.flight.departure}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Самолёт</div>
                        <div className="font-semibold">{booking.flight.aircraft}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Место</div>
                        <div className="font-semibold">{booking.seat}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {booking.status === 'pending' && (
                        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90">
                              <Icon name="CreditCard" size={16} className="mr-2" />
                              Оплатить
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Оплата билета</DialogTitle>
                              <DialogDescription>Бронирование {booking.id}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="text-center">
                                <p className="text-3xl font-bold text-primary mb-2">
                                  {booking.flight.price.toLocaleString('ru-RU')} ₽
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.flight.from} → {booking.flight.to}
                                </p>
                              </div>
                              <Button onClick={handlePayment} className="w-full bg-accent hover:bg-accent/90">
                                Перейти к оплате
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      <Dialog open={isConfirmPaymentOpen} onOpenChange={setIsConfirmPaymentOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Подтверждение покупки</DialogTitle>
                            <DialogDescription>Точно хотите купить этот билет?</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary mb-2">
                                {bookings[bookings.length - 1]?.flight.price.toLocaleString('ru-RU')} ₽
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {bookings[bookings.length - 1]?.flight.from} → {bookings[bookings.length - 1]?.flight.to}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={() => setIsConfirmPaymentOpen(false)} className="flex-1">
                                Отмена
                              </Button>
                              <Button onClick={confirmPayment} className="flex-1 bg-accent hover:bg-accent/90">
                                Подтвердить
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {booking.status === 'paid' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Icon name="Download" size={16} className="mr-2" />
                            Скачать билет
                          </Button>
                          <Button variant="outline" size="sm">
                            <Icon name="CheckCircle" size={16} className="mr-2" />
                            Онлайн-регистрация
                          </Button>
                          <Button variant="outline" size="sm">
                            <Icon name="Luggage" size={16} className="mr-2" />
                            Добавить багаж
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRefund(booking.id)}
                          >
                            <Icon name="RotateCcw" size={16} className="mr-2" />
                            Вернуть билет
                          </Button>
                        </>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedBookingForInfo(booking)}
                          >
                            <Icon name="Info" size={16} className="mr-2" />
                            Информация о билете
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Полная информация о билете</DialogTitle>
                            <DialogDescription>Код бронирования: {booking.id}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Информация о рейсе</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Маршрут</p>
                                    <p className="font-semibold">{booking.flight.from} → {booking.flight.to}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Номер рейса</p>
                                    <p className="font-semibold">DA-{booking.flight.id.padStart(4, '0')}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Вылет</p>
                                    <p className="font-semibold">{booking.flight.departure}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Прилёт</p>
                                    <p className="font-semibold">{booking.flight.arrival}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Длительность</p>
                                    <p className="font-semibold">{booking.flight.duration}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Самолёт</p>
                                    <p className="font-semibold">{booking.flight.aircraft}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Класс обслуживания</p>
                                    <p className="font-semibold">
                                      {booking.class === 'economy' ? 'Эконом' : booking.class === 'business' ? 'Бизнес' : 'Первый класс'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Место</p>
                                    <p className="font-semibold">{booking.seat}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Количество пассажиров</p>
                                    <p className="font-semibold">{booking.passengers}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Стоимость</p>
                                    <p className="font-semibold text-primary text-lg">
                                      {booking.flight.price.toLocaleString('ru-RU')} ₽
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Статус</p>
                                    <Badge className={booking.status === 'paid' ? 'bg-green-500' : booking.status === 'refunded' ? 'bg-red-500' : 'bg-yellow-500'}>
                                      {booking.status === 'paid' ? 'Оплачено' : booking.status === 'refunded' ? 'Возвращено' : 'Ожидает оплаты'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Багаж</p>
                                    <p className="font-semibold">1 место, 23 кг</p>
                                  </div>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                  <p className="text-sm text-muted-foreground mb-2">Условия тарифа</p>
                                  <ul className="text-sm space-y-1">
                                    <li>✓ Бесплатная регистрация онлайн</li>
                                    <li>✓ Выбор места в салоне</li>
                                    <li>✓ Питание на борту включено</li>
                                    <li>✓ Возврат билета до вылета (комиссия 15%)</li>
                                  </ul>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Icon name="Ticket" size={48} className="mx-auto mb-4 opacity-50" />
                <p>У вас пока нет бронирований</p>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {activeTab === 'reviews' && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">Отзывы пассажиров</h2>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Оставить отзыв</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Маршрут</Label>
                <Input placeholder="Москва - Дубай" className="mt-1" />
              </div>
              <div>
                <Label>Дата полёта</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left mt-1">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      Выберите дату
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Оценка</Label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-2xl hover:scale-110 transition-transform">
                      <Icon name="Star" size={24} className="fill-accent text-accent" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Ваш отзыв</Label>
                <Textarea
                  placeholder="Расскажите о вашем опыте полёта с Duke Air"
                  className="mt-1 min-h-32"
                />
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90">
                Отправить отзыв
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {[
              { name: 'Анна М.', route: 'Москва - Париж', date: '15 октября 2024', rating: 5, text: 'Отличный сервис! Персонал очень вежливый, самолёт современный и чистый.' },
              { name: 'Дмитрий К.', route: 'Санкт-Петербург - Дубай', date: '10 октября 2024', rating: 5, text: 'Всё прошло идеально. Рейс вовремя, багаж доставлен быстро.' },
              { name: 'Елена С.', route: 'Москва - Токио', date: '5 октября 2024', rating: 4, text: 'Хороший полёт, удобные кресла в бизнес-классе. Единственное - хотелось бы больше выбора в меню.' }
            ].map((review, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.route} • {review.date}</CardDescription>
                    </div>
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Icon key={i} name="Star" size={16} className="fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'about' && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6">О Duke Air</h2>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Наша миссия</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Duke Air — это современная авиакомпания, которая стремится сделать полёты комфортными, 
                безопасными и доступными для каждого пассажира. Мы соединяем континенты и культуры, 
                открывая новые горизонты для путешественников по всему миру.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">150+</div>
                  <div className="text-muted-foreground">Направлений</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <div className="text-muted-foreground">Самолётов</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">10M+</div>
                  <div className="text-muted-foreground">Пассажиров в год</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Наш флот</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { model: 'Boeing 777', seats: '350 мест', description: 'Дальнемагистральный широкофюзеляжный самолёт' },
                  { model: 'Airbus A320', seats: '180 мест', description: 'Среднемагистральный узкофюзеляжный самолёт' },
                  { model: 'Boeing 737', seats: '189 мест', description: 'Среднемагистральный узкофюзеляжный самолёт' }
                ].map((aircraft) => (
                  <div key={aircraft.model} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Icon name="Plane" size={32} className="text-primary" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{aircraft.model}</h4>
                      <p className="text-sm text-muted-foreground">{aircraft.description}</p>
                    </div>
                    <Badge variant="secondary">{aircraft.seats}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <footer className="bg-primary text-primary-foreground mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-accent">Duke Air</h4>
              <p className="text-sm opacity-90">Мы соединяем континенты</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:text-accent transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Карьера</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Пресс-центр</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#" className="hover:text-accent transition-colors">Правила перевозки</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Багаж</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>+7 (800) 555-35-35</li>
                <li>info@dukeair.com</li>
                <li className="flex gap-2 mt-4">
                  <a href="#" className="hover:text-accent transition-colors">
                    <Icon name="Facebook" size={20} />
                  </a>
                  <a href="#" className="hover:text-accent transition-colors">
                    <Icon name="Instagram" size={20} />
                  </a>
                  <a href="#" className="hover:text-accent transition-colors">
                    <Icon name="Twitter" size={20} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
            <p>© 2024 Duke Air. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;