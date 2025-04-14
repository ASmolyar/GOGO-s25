import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Typography, Grid } from '@mui/material';

const Impact = () => {
  // Data with enhanced metallic colors
  const data = [
    {
      id: "Foundations and The Children's Trust",
      label: "Foundations and The Children's Trust",
      value: 38,
      color: '#4B9FEF', // Enhanced metallic blue
    },
    {
      id: 'Individuals',
      label: 'Individuals',
      value: 25,
      color: '#FFD761', // Enhanced metallic gold
    },
    {
      id: 'Local Government',
      label: 'Local Government',
      value: 20,
      color: '#6941B5', // Enhanced metallic purple
    },
    {
      id: 'State Government',
      label: 'State Government',
      value: 9,
      color: '#6c96cc', // Enhanced metallic pale blue
    },
    {
      id: 'Corporate',
      label: 'Corporate',
      value: 4,
      color: '#FFF192', // Enhanced metallic pale yellow
    },
    {
      id: 'Other Income',
      label: 'Other Income',
      value: 3,
      color: '#df8df2', // Enhanced metallic pink
    },
    {
      id: 'Federal Government',
      label: 'Federal Government',
      value: 1,
      color: '#e6e6e6', // Enhanced metallic gray
    },
  ];

  return (
    <Grid component="div" container>
      <div style={{ backgroundColor: 'black', padding: '20px', minHeight: '100vh' }}>
        {/* Google Font Import */}
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        </style>

        <Typography
          variant="h2"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            color: '#ffffff',
            fontWeight: 700,
            mb: 4,
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '1px',
          }}
        >
          WHERE THE MONEY COMES FROM
        </Typography>

        <div style={{ height: '600px', position: 'relative' }}>
          <ResponsivePie
            data={data}
            margin={{ top: 40, right: 160, bottom: 40, left: 40 }}
            innerRadius={0.02} // Tiny inner radius for slight center gap
            padAngle={1.2}
            cornerRadius={0} // Sharp corners
            activeOuterRadiusOffset={8}
            borderWidth={0.5} // Thin border to enhance metallic look
            borderColor={{ from: 'color', modifiers: [['brighter', 1.6]] }} // Bright border for metallic shine
            enableArcLinkLabels={true}
            arcLinkLabelsSkipAngle={5}
            arcLinkLabelsTextColor="#ffffff"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLinkLabelsStraightLength={15}
            arcLinkLabelsTextOffset={5}
            // Custom position for Federal Government label
            arcLinkLabelsOffset={5}
            // Remove invalid property
            // arcLinkLabelsFont removed
            enableArcLabels={false} // Remove numbers on the pie sections
            defs={[
              // Gradients for each slice to create metallic effect
              {
                id: 'metallic-blue',
                type: 'linearGradient',
                colors: [
                  { offset: 0, color: '#1A6ED6' },
                  { offset: 100, color: '#63B1FF' },
                ],
              },
              {
                id: 'metallic-yellow',
                type: 'linearGradient',
                colors: [
                  { offset: 0, color: '#E6B800' },
                  { offset: 100, color: '#FFE680' },
                ],
              },
              {
                id: 'metallic-paleyellow',
                type: 'linearGradient',
                colors: [
                  { offset: 0, color: '#FFF192' },
                  { offset: 100, color: '#FFFFB7' },
                ],
              },
              {
                id: 'metallic-purple',
                type: 'linearGradient',
                colors: [
                  { offset: 0, color: '#6941B5' },
                  { offset: 100, color: '#B090EA' },
                ],
              },
              {
                id: 'metallic-paleblue',
                type: 'linearGradient',
                colors: [
                  { offset: 0, color: '#6c96cc' },
                  { offset: 100, color: '#c5e2f0' },
                ],
              },
              {
                id: 'metallic-pink',
                type: 'linearGradient',
                colors: [
                  { offset: 0, color: '#df8df2' },
                  { offset: 100, color: '#f5c9ff' },
                ],
              },
              {
                id: 'metallic-gray',
                type: 'linearGradient',
                colors: [
                  { offset: 0, color: '#9C9C9C' },
                  { offset: 100, color: '#E0E0E0' },
                ],
              },
            ]}
            fill={[
              {
                match: { id: "Foundations and The Children's Trust" },
                id: 'metallic-blue',
              },
              { match: { id: 'Individuals' }, id: 'metallic-yellow' },
              { match: { id: 'Local Government' }, id: 'metallic-purple' },
              { match: { id: 'State Government' }, id: 'metallic-paleblue' },
              { match: { id: 'Corporate' }, id: 'metallic-paleyellow' },
              { match: { id: 'Other Income' }, id: 'metallic-pink' },
              { match: { id: 'Federal Government' }, id: 'metallic-gray' },
            ]}
            colors={{ datum: 'data.color' }}
            valueFormat={(value: number) => `${value}%`}
            theme={{
              background: 'transparent',
              text: {
                fill: '#ffffff',
                fontFamily: 'Bebas Neue',
                fontSize: 20, // Increased font size
              },
              labels: {
                text: {
                  fontFamily: 'Bebas Neue',
                  fontSize: 20, // Increased font size
                },
              },
            }}
            layers={['arcs', 'arcLinkLabels']}
            // Custom function to control label positioning for Federal Government
            arcLinkLabelsDiagonalLength={16}
            arcLabelsRadiusOffset={0.7}
          />
        </div>
      </div>
    </Grid>
  );
};

export default Impact;
