'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, DollarSign, BarChart3, Code, Zap, Shield, Target } from 'lucide-react';

// Simulated market data
const generateMarketData = () => {
  const data = [];
  let price = 1.0850;
  for (let i = 0; i < 50; i++) {
    price += (Math.random() - 0.5) * 0.002;
    data.push({
      time: i,
      price: parseFloat(price.toFixed(5)),
      sma20: parseFloat((price + (Math.random() - 0.5) * 0.001).toFixed(5)),
      ema12: parseFloat((price - 0.001).toFixed(5)),
    });
  }
  return data;
};

export default function Home() {
  const [selectedStrategy, setSelectedStrategy] = useState('scalping');
  const [marketData] = useState(generateMarketData());

  const strategies = [
    {
      id: 'scalping',
      name: 'Scalping EA',
      description: 'Estratégia de curto prazo com múltiplas operações rápidas',
      indicators: ['EMA 12/26', 'RSI', 'Bollinger Bands'],
      timeframe: 'M1, M5',
      riskReward: '1:1.5',
      winRate: '68%',
      code: `//+------------------------------------------------------------------+
//| Expert Advisor: Scalping Pro                                      |
//| Estratégia baseada em EMA e RSI                                   |
//+------------------------------------------------------------------+
input double LotSize = 0.01;
input int StopLoss = 20;
input int TakeProfit = 30;
input int EMA_Fast = 12;
input int EMA_Slow = 26;
input int RSI_Period = 14;

int OnInit()
{
   Print("Scalping EA Iniciado");
   return(INIT_SUCCEEDED);
}

void OnTick()
{
   double ema_fast = iMA(_Symbol, PERIOD_M5, EMA_Fast, 0, MODE_EMA, PRICE_CLOSE);
   double ema_slow = iMA(_Symbol, PERIOD_M5, EMA_Slow, 0, MODE_EMA, PRICE_CLOSE);
   double rsi = iRSI(_Symbol, PERIOD_M5, RSI_Period, PRICE_CLOSE);

   // Sinal de Compra
   if(ema_fast > ema_slow && rsi < 30 && PositionsTotal() == 0)
   {
      double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
      double sl = ask - StopLoss * _Point;
      double tp = ask + TakeProfit * _Point;

      // Abrir posição de compra
      trade.Buy(LotSize, _Symbol, ask, sl, tp, "Scalping Buy");
   }

   // Sinal de Venda
   if(ema_fast < ema_slow && rsi > 70 && PositionsTotal() == 0)
   {
      double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
      double sl = bid + StopLoss * _Point;
      double tp = bid - TakeProfit * _Point;

      // Abrir posição de venda
      trade.Sell(LotSize, _Symbol, bid, sl, tp, "Scalping Sell");
   }
}`
    },
    {
      id: 'swing',
      name: 'Swing Trading EA',
      description: 'Operações de médio prazo seguindo tendências',
      indicators: ['SMA 50/200', 'MACD', 'ADX'],
      timeframe: 'H1, H4',
      riskReward: '1:3',
      winRate: '55%',
      code: `//+------------------------------------------------------------------+
//| Expert Advisor: Swing Trading Pro                                 |
//| Estratégia baseada em tendências de médio prazo                   |
//+------------------------------------------------------------------+
input double LotSize = 0.1;
input int StopLoss = 100;
input int TakeProfit = 300;
input int SMA_Fast = 50;
input int SMA_Slow = 200;

int OnInit()
{
   Print("Swing Trading EA Iniciado");
   return(INIT_SUCCEEDED);
}

void OnTick()
{
   double sma_fast = iMA(_Symbol, PERIOD_H4, SMA_Fast, 0, MODE_SMA, PRICE_CLOSE);
   double sma_slow = iMA(_Symbol, PERIOD_H4, SMA_Slow, 0, MODE_SMA, PRICE_CLOSE);
   double macd_main = iMACD(_Symbol, PERIOD_H4, 12, 26, 9, PRICE_CLOSE, MODE_MAIN);
   double adx = iADX(_Symbol, PERIOD_H4, 14, PRICE_CLOSE, MODE_MAIN);

   // Confirmação de tendência forte
   if(adx > 25)
   {
      // Golden Cross - Sinal de compra
      if(sma_fast > sma_slow && macd_main > 0 && PositionsTotal() == 0)
      {
         double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
         double sl = ask - StopLoss * _Point;
         double tp = ask + TakeProfit * _Point;
         trade.Buy(LotSize, _Symbol, ask, sl, tp, "Swing Buy");
      }

      // Death Cross - Sinal de venda
      if(sma_fast < sma_slow && macd_main < 0 && PositionsTotal() == 0)
      {
         double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
         double sl = bid + StopLoss * _Point;
         double tp = bid - TakeProfit * _Point;
         trade.Sell(LotSize, _Symbol, bid, sl, tp, "Swing Sell");
      }
   }
}`
    },
    {
      id: 'breakout',
      name: 'Breakout EA',
      description: 'Captura rompimentos de suportes e resistências',
      indicators: ['Support/Resistance', 'Volume', 'ATR'],
      timeframe: 'M15, H1',
      riskReward: '1:2',
      winRate: '62%',
      code: `//+------------------------------------------------------------------+
//| Expert Advisor: Breakout Pro                                      |
//| Estratégia de rompimento de níveis chave                          |
//+------------------------------------------------------------------+
input double LotSize = 0.05;
input int StopLoss = 50;
input int TakeProfit = 100;
input int ATR_Period = 14;
input int Lookback = 20;

int OnInit()
{
   Print("Breakout EA Iniciado");
   return(INIT_SUCCEEDED);
}

void OnTick()
{
   double atr = iATR(_Symbol, PERIOD_H1, ATR_Period);
   double high = iHigh(_Symbol, PERIOD_H1, iHighest(_Symbol, PERIOD_H1, MODE_HIGH, Lookback, 1));
   double low = iLow(_Symbol, PERIOD_H1, iLowest(_Symbol, PERIOD_H1, MODE_LOW, Lookback, 1));
   double current_price = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   // Rompimento de resistência com volatilidade
   if(current_price > high && atr > 0.0010 && PositionsTotal() == 0)
   {
      double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
      double sl = ask - StopLoss * _Point;
      double tp = ask + TakeProfit * _Point;
      trade.Buy(LotSize, _Symbol, ask, sl, tp, "Breakout Buy");
   }

   // Rompimento de suporte com volatilidade
   if(current_price < low && atr > 0.0010 && PositionsTotal() == 0)
   {
      double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
      double sl = bid + StopLoss * _Point;
      double tp = bid - TakeProfit * _Point;
      trade.Sell(LotSize, _Symbol, bid, sl, tp, "Breakout Sell");
   }
}`
    },
    {
      id: 'grid',
      name: 'Grid Trading EA',
      description: 'Sistema de grid com gerenciamento de múltiplas posições',
      indicators: ['Price Levels', 'Risk Management'],
      timeframe: 'H1, H4',
      riskReward: 'Variable',
      winRate: '70%',
      code: `//+------------------------------------------------------------------+
//| Expert Advisor: Grid Trading System                               |
//| Sistema de grid automatizado com gerenciamento de risco           |
//+------------------------------------------------------------------+
input double LotSize = 0.01;
input int GridStep = 50;
input int MaxPositions = 5;
input int TakeProfit = 100;

double LastBuyPrice = 0;
double LastSellPrice = 0;

int OnInit()
{
   Print("Grid Trading EA Iniciado");
   return(INIT_SUCCEEDED);
}

void OnTick()
{
   double current_price = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   int total_positions = PositionsTotal();

   // Inicializar grid
   if(total_positions == 0)
   {
      double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
      double tp = ask + TakeProfit * _Point;
      trade.Buy(LotSize, _Symbol, ask, 0, tp, "Grid Initial");
      LastBuyPrice = ask;
   }

   // Adicionar posições no grid
   if(total_positions < MaxPositions)
   {
      double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);

      if(LastBuyPrice > 0 && current_price <= LastBuyPrice - GridStep * _Point)
      {
         double tp = ask + TakeProfit * _Point;
         trade.Buy(LotSize, _Symbol, ask, 0, tp, "Grid Level");
         LastBuyPrice = ask;
      }
   }

   // Fechar todas as posições quando atingir lucro total
   if(AccountInfoDouble(ACCOUNT_PROFIT) >= TakeProfit * 10)
   {
      CloseAllPositions();
      LastBuyPrice = 0;
   }
}

void CloseAllPositions()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      trade.PositionClose(ticket);
   }
}`
    }
  ];

  const currentStrategy = strategies.find(s => s.id === selectedStrategy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">MT5 Strategy Dashboard</h1>
          </div>
          <p className="text-xl text-gray-300">Estratégias Profissionais e Expert Advisors para MetaTrader 5</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-8 h-8 text-green-400" />
              <h3 className="text-gray-400 text-sm">Status do Sistema</h3>
            </div>
            <p className="text-2xl font-bold text-white">Ativo</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-yellow-400" />
              <h3 className="text-gray-400 text-sm">Profit Médio</h3>
            </div>
            <p className="text-2xl font-bold text-white">+12.5%</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <h3 className="text-gray-400 text-sm">Operações Hoje</h3>
            </div>
            <p className="text-2xl font-bold text-white">27</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-purple-400" />
              <h3 className="text-gray-400 text-sm">Win Rate</h3>
            </div>
            <p className="text-2xl font-bold text-white">64%</p>
          </div>
        </div>

        {/* Market Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Análise de Mercado - EUR/USD
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={['dataMin - 0.002', 'dataMax + 0.002']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #3B82F6' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} name="Preço" />
              <Line type="monotone" dataKey="sma20" stroke="#10B981" strokeWidth={2} name="SMA 20" />
              <Line type="monotone" dataKey="ema12" stroke="#F59E0B" strokeWidth={2} name="EMA 12" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Strategy Selection */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Estratégias Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {strategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedStrategy === strategy.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600 bg-gray-700/30 hover:border-blue-400'
                }`}
              >
                <h3 className="font-bold text-white mb-2">{strategy.name}</h3>
                <p className="text-sm text-gray-400">{strategy.description}</p>
              </button>
            ))}
          </div>

          {/* Strategy Details */}
          {currentStrategy && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-700/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Detalhes da Estratégia
                </h3>
                <div className="space-y-3 text-gray-300">
                  <div>
                    <span className="font-semibold text-white">Indicadores:</span>
                    <span className="ml-2">{currentStrategy.indicators.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Timeframe:</span>
                    <span className="ml-2">{currentStrategy.timeframe}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Risk/Reward:</span>
                    <span className="ml-2">{currentStrategy.riskReward}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Win Rate:</span>
                    <span className="ml-2 text-green-400">{currentStrategy.winRate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-400" />
                  Código MQL5
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400 font-mono">
                    {currentStrategy.code}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6">
            <Zap className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Execução Rápida</h3>
            <p className="text-blue-100">Latência ultra-baixa para operações em milissegundos</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6">
            <Shield className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Gerenciamento de Risco</h3>
            <p className="text-green-100">Stop Loss dinâmico e trailing stop automático</p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6">
            <Target className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Backtesting Avançado</h3>
            <p className="text-purple-100">Teste suas estratégias com dados históricos</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400 mt-12 pb-8">
          <p className="text-sm">
            ⚠️ Trading envolve riscos. Use apenas capital que você pode perder.
            Teste sempre suas estratégias em conta demo antes de operar com dinheiro real.
          </p>
        </footer>
      </div>
    </div>
  );
}
