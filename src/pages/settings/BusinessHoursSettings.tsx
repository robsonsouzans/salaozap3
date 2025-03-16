
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast";
import SettingsLayout from '@/components/settings/SettingsLayout';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, title, description, children }) => {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-start">
        <div className="mr-4 mt-0.5 rounded-full bg-salon-50 p-2 dark:bg-gray-800">
          <Icon className="h-5 w-5 text-salon-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

const TimeSelect = ({ value, onChange, disabled = false }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="h-9 rounded-md px-3 py-2 border border-input bg-background text-sm disabled:opacity-50"
    >
      <option value="closed">Fechado</option>
      <option value="08:00">08:00</option>
      <option value="09:00">09:00</option>
      <option value="10:00">10:00</option>
      <option value="11:00">11:00</option>
      <option value="12:00">12:00</option>
      <option value="13:00">13:00</option>
      <option value="14:00">14:00</option>
      <option value="15:00">15:00</option>
      <option value="16:00">16:00</option>
      <option value="17:00">17:00</option>
      <option value="18:00">18:00</option>
      <option value="19:00">19:00</option>
      <option value="20:00">20:00</option>
      <option value="21:00">21:00</option>
      <option value="22:00">22:00</option>
    </select>
  );
};

const DaySchedule = ({ day, isOpen, openTime, closeTime, onToggle, onTimeChange }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center">
        <Switch
          checked={isOpen}
          onCheckedChange={onToggle}
        />
        <span className="ml-3 font-medium text-sm">{day}</span>
      </div>
      <div className="flex items-center space-x-2">
        <TimeSelect 
          value={openTime}
          onChange={(value) => onTimeChange('open', value)}
          disabled={!isOpen}
        />
        <span className="text-gray-500">até</span>
        <TimeSelect 
          value={closeTime}
          onChange={(value) => onTimeChange('close', value)}
          disabled={!isOpen}
        />
      </div>
    </div>
  );
};

const BusinessHoursSettings: React.FC = () => {
  const { toast } = useToast();
  
  const [schedule, setSchedule] = useState({
    monday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
    tuesday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
    wednesday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
    thursday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
    friday: { isOpen: true, openTime: '09:00', closeTime: '19:00' },
    saturday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
    sunday: { isOpen: false, openTime: 'closed', closeTime: 'closed' },
  });
  
  const [breakTime, setBreakTime] = useState({
    enabled: true,
    startTime: '12:00',
    endTime: '13:00'
  });
  
  const handleDayToggle = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
        openTime: !prev[day].isOpen ? '09:00' : 'closed',
        closeTime: !prev[day].isOpen ? '19:00' : 'closed',
      }
    }));
  };
  
  const handleTimeChange = (day, type, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type === 'open' ? 'openTime' : 'closeTime']: value
      }
    }));
  };
  
  const saveSettings = () => {
    toast({
      title: "Horários atualizados",
      description: "Os horários de funcionamento foram atualizados com sucesso"
    });
  };
  
  return (
    <SettingsLayout 
      title="Horários de Funcionamento" 
      description="Configure os dias e horários de atendimento do seu salão"
      currentTab="general"
    >
      <Card className="border-none shadow-md dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Horários de Atendimento</CardTitle>
          <CardDescription>
            Defina os horários em que seu salão estará aberto para agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <DaySchedule
              day="Segunda-feira"
              isOpen={schedule.monday.isOpen}
              openTime={schedule.monday.openTime}
              closeTime={schedule.monday.closeTime}
              onToggle={() => handleDayToggle('monday')}
              onTimeChange={(type, value) => handleTimeChange('monday', type, value)}
            />
            
            <DaySchedule
              day="Terça-feira"
              isOpen={schedule.tuesday.isOpen}
              openTime={schedule.tuesday.openTime}
              closeTime={schedule.tuesday.closeTime}
              onToggle={() => handleDayToggle('tuesday')}
              onTimeChange={(type, value) => handleTimeChange('tuesday', type, value)}
            />
            
            <DaySchedule
              day="Quarta-feira"
              isOpen={schedule.wednesday.isOpen}
              openTime={schedule.wednesday.openTime}
              closeTime={schedule.wednesday.closeTime}
              onToggle={() => handleDayToggle('wednesday')}
              onTimeChange={(type, value) => handleTimeChange('wednesday', type, value)}
            />
            
            <DaySchedule
              day="Quinta-feira"
              isOpen={schedule.thursday.isOpen}
              openTime={schedule.thursday.openTime}
              closeTime={schedule.thursday.closeTime}
              onToggle={() => handleDayToggle('thursday')}
              onTimeChange={(type, value) => handleTimeChange('thursday', type, value)}
            />
            
            <DaySchedule
              day="Sexta-feira"
              isOpen={schedule.friday.isOpen}
              openTime={schedule.friday.openTime}
              closeTime={schedule.friday.closeTime}
              onToggle={() => handleDayToggle('friday')}
              onTimeChange={(type, value) => handleTimeChange('friday', type, value)}
            />
            
            <DaySchedule
              day="Sábado"
              isOpen={schedule.saturday.isOpen}
              openTime={schedule.saturday.openTime}
              closeTime={schedule.saturday.closeTime}
              onToggle={() => handleDayToggle('saturday')}
              onTimeChange={(type, value) => handleTimeChange('saturday', type, value)}
            />
            
            <DaySchedule
              day="Domingo"
              isOpen={schedule.sunday.isOpen}
              openTime={schedule.sunday.openTime}
              closeTime={schedule.sunday.closeTime}
              onToggle={() => handleDayToggle('sunday')}
              onTimeChange={(type, value) => handleTimeChange('sunday', type, value)}
            />
          </div>
          
          <SettingItem
            icon={Clock}
            title="Intervalo para almoço/descanso"
            description="Defina um período de pausa durante o expediente"
          >
            <div className="flex items-center space-x-2">
              <Switch
                checked={breakTime.enabled}
                onCheckedChange={(checked) => setBreakTime(prev => ({ ...prev, enabled: checked }))}
              />
              {breakTime.enabled && (
                <>
                  <TimeSelect 
                    value={breakTime.startTime}
                    onChange={(value) => setBreakTime(prev => ({ ...prev, startTime: value }))}
                  />
                  <span className="text-gray-500">até</span>
                  <TimeSelect 
                    value={breakTime.endTime}
                    onChange={(value) => setBreakTime(prev => ({ ...prev, endTime: value }))}
                  />
                </>
              )}
            </div>
          </SettingItem>
          
          <div className="pt-4">
            <Button onClick={saveSettings}>Salvar alterações</Button>
          </div>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default BusinessHoursSettings;
