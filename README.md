# stickyants-react-slot

A library for React application to support slots. Works in a similar fashion to Vue's slots.

## Usage

```typescript

import * as React from 'react';
import {
  SlotsContainer,
  Slot,
  SlotContent
  } from 'stickyants-react-slot';


function MySidebar(){
  return (
    <SlotContent name="sidebar">
      <div className="text">This is just a test</div>
    </SlotContent>
  );
}

function MySubApp(){
  return (
    <SlotContent name="working-area">
      <div className="my-working-area">This goes in the working area</div>
    </SlotContent>
  );
}

function App(){
  return (
    <SlotContainer>
      <div clasName="container">
        <div className="row">
          <div className="col-md-3">
            <Slot name="sidebar" />
          </div>
          <div className="col-md-9">
            <Slot name="working-area" />
          </div>
        </div>
      </div>
      <MySidebar />
      <MySubApp />
    </SlotContainer>
  );
}

```
