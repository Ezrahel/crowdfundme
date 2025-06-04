import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Container, Grid, Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { styled } from '@mui/system';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Styled components for custom styling
const MetricCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#e8f5e9', // Light green background
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
}));

const ChartCard = styled(Card)({
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
});

interface CampaignDashboardProps {
  campaignName?: string;
  description?: string;
}

const NewCampaignDashboard: React.FC<CampaignDashboardProps> = ({ campaignName = 'Campaign Name', description = 'Track your campaign\'s progress and performance' }) => {
  const theme = useTheme();
  // Mock Data
  const totalDonations = 12500;
  const totalDonationsChange = 10;
  const campaignProgress = 62;
  const campaignProgressChange = 5;
  const daysRemaining = 15;
  const daysRemainingChange = -2;
  const donationsOverTimeValue = 12500; // Renamed to avoid conflict with chart data object
  const donationsOverTimeChange = 10;

  // Mock data for charts
  const donationsOverTimeData = {
    labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
    datasets: [
      {
        label: 'Donations',
        data: [120, 300, 800, 1500, 2500, 4000, 5500, 8000, 10000, 12500],
        fill: true,
        backgroundColor: 'rgba(26, 127, 55, 0.1)', // Light green with transparency
        borderColor: '#1a7f37', // Green color
        tension: 0.4,
        pointBackgroundColor: '#1a7f37',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const topDonorsData = {
    labels: ['Donor 1', 'Donor 2', 'Donor 3', 'Donor 4', 'Donor 5', 'Donor 6', 'Donor 7'],
    datasets: [
      {
        label: 'Amount',
        data: [1000, 800, 700, 500, 300, 900, 1200],
        backgroundColor: '#1a7f37', // Green color
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
           color: theme.palette.text.secondary,
        }
      },
      y: {
        grid: {
          borderDash: [5, 5],
          color: theme.palette.divider,
        },
        ticks: {
           color: theme.palette.text.secondary,
           callback: function(value: any) {
             return '$ ' + value.toLocaleString();
           }
        }
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
         callbacks: {
            label: function(tooltipItem: any) {
               return '$ ' + tooltipItem.raw.toLocaleString();
            }
         }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
           color: theme.palette.text.secondary,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [5, 5],
          color: theme.palette.divider,
        },
         ticks: {
           color: theme.palette.text.secondary,
           callback: function(value: any) {
             return '$ ' + value.toLocaleString();
           }
        }
      },
    },
  };

  const formatChange = (change: number) => {
    const color = change >= 0 ? theme.palette.success.main : theme.palette.error.main;
    const sign = change > 0 ? '+' : '';
    return <Typography variant="body2" sx={{ color: color }}>{`${sign}${change}%`}</Typography>;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Campaign Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Track your campaign's progress and performance
      </Typography>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid >
          <MetricCard>
            <CardContent>
              <Typography color="text.secondary">Total Donations</Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
                ${totalDonations.toLocaleString()}
              </Typography>
              {formatChange(totalDonationsChange)}
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid >
          <MetricCard>
            <CardContent>
              <Typography color="text.secondary">Campaign Progress</Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
                {campaignProgress}%
              </Typography>
              {formatChange(campaignProgressChange)}
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid >
          <MetricCard>
            <CardContent>
              <Typography color="text.secondary">Days Remaining</Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
                {daysRemaining}
              </Typography>
              {formatChange(daysRemainingChange)}
            </CardContent>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid >
          <ChartCard>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Donations Over Time
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                 ${donationsOverTimeValue.toLocaleString()}
              </Typography>
               <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Last 30 Days {formatChange(donationsOverTimeChange)}
              </Typography>
              <Box sx={{ height: 300 }}> {/* Adjust height as needed */}
                 <Line data={donationsOverTimeData} options={chartOptions} />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        <Grid >
          <ChartCard>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Top Donors
              </Typography>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                 ${topDonorsData.datasets[0].data.reduce((sum, val) => sum + val, 0).toLocaleString()}
              </Typography>
               <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                All Time {formatChange(5)}
              </Typography>
              <Box sx={{ height: 300 }}> {/* Adjust height as needed */}
                <Bar data={topDonorsData} options={barChartOptions} />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewCampaignDashboard; 