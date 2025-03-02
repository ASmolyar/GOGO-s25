import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography, Container } from '@mui/material';

const Impact = () => {
  // Data from the image
  const data = [
    {
      id: "Foundations and The Children's Trust",
      label: "Foundations and The Children's Trust",
      value: 38,
      color: "#5B9BD5" // Blue
    },
    {
      id: "Individuals",
      label: "Individuals",
      value: 25,
      color: "#FFCC66" // Yellow
    },
    {
      id: "Local Government",
      label: "Local Government",
      value: 20,
      color: "#A9D18E" // Light green
    },
    {
      id: "State Government",
      label: "State Government",
      value: 9,
      color: "#8064A2" // Purple
    },
    {
      id: "Corporate",
      label: "Corporate",
      value: 4,
      color: "#C5E0B4" // Pale green
    },
    {
      id: "Other Income",
      label: "Other Income",
      value: 3,
      color: "#FF99CC" // Pink
    },
    {
      id: "Federal Government",
      label: "Federal Government",
      value: 1,
      color: "#BFBFBF" // Gray
    }
  ];

  return (
    <div style={{ backgroundColor: 'black', padding: '20px', minHeight: '100vh' }}>
      <Typography 
        variant="h2" 
        component="h1" 
        align="center" 
        gutterBottom
        sx={{ 
          color: '#A9D18E', 
          fontWeight: 700,
          mb: 4,
          fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
          letterSpacing: '0.5px'
        }}
      >
        WHERE THE MONEY COMES FROM
      </Typography>
      
      <div style={{ height: '600px' }}>
        <ResponsivePie
          data={data}
          margin={{ top: 40, right: 160, bottom: 40, left: 40 }}
          innerRadius={0}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={2}
          borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#ffffff"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor="#000000"
          colors={{ datum: 'data.color' }}
          valueFormat={value => `${value}%`}
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 20,
              translateY: 0,
              itemsSpacing: 10,
              itemWidth: 100,
              itemHeight: 24,
              itemTextColor: '#ffffff',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: '#A9D18E'
                  }
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
};

export default Impact;