import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isToday, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiClock, FiPower } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Calendar,
  Appointment,
} from './styles';
import { ThemeConsumer } from 'styled-components';
import { NumberLiteralType } from 'typescript';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const imgDefault =
  'https://avatars2.githubusercontent.com/u/54192694?s=460&u=a0ac6a9b16621a72fd3bfd6bba0c0081c2259d5b&v=4';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const { user, signOut } = useAuth();

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const handleDateChange = useCallback((day: Date, modifers: DayModifiers) => {
    if (modifers.available) {
      setSelectedDate(day);
    }
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user?.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then((response) => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user?.id]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter((monthDay) => monthDay?.available === false)
      .map((monthDay) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay?.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]); //memorizar valor especifico e dizer quando quer q seja recarregado o valor

  const selectedateAsText = useMemo(() => {
    return format(selectedD);
  }, [selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Gobarber" />

          <Profile>
            <img src={user?.avatar_url || imgDefault} alt={user?.name} />
            <div>
              <span>Bem-vindo</span>
              <strong>{user?.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            <span>{isToday(selectedDate) && 'Hoje'}</span>
            <span>Dia 03</span>
            <span>Sexta-feira</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src={imgDefault} alt="Charles Pereira" />

              <strong>Charles Pereira</strong>

              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img src={imgDefault} alt="Charles Pereira" />

                <strong>Charles Pereira</strong>
              </div>
            </Appointment>
            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img src={imgDefault} alt="Charles Pereira" />

                <strong>Charles Pereira</strong>
              </div>
            </Appointment>
          </Section>
          <Section>
            <strong>Tarde</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>
              <div>
                <img src={imgDefault} alt="Charles Pereira" />

                <strong>Charles Pereira</strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
            onDayClick={handleDateChange}
            selectedDays={selectedDate}
            onMonthChange={handleMonthChange}
            months={months}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
