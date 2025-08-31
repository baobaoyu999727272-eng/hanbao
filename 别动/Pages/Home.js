import React from 'react';
import PhoneFrame from '../components/phone/PhoneFrame';
import HomeScreen from '../components/home/HomeScreen';

export default function Home() {
  return (
    <PhoneFrame>
      <HomeScreen />
    </PhoneFrame>
  );
}
