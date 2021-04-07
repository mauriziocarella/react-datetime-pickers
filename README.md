# react-datetime-pickers

> React ready picker components for dates and time (month picker, week picker, day picker)

[![NPM](https://img.shields.io/npm/v/react-datetime-pickers.svg)](https://www.npmjs.com/package/react-datetime-pickers) [![Downloads](https://img.shields.io/npm/dm/react-datetime-pickers.svg)](https://www.npmjs.com/package/react-datetime-pickers) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<img alt="calendar" src="https://raw.githubusercontent.com/mauriziocarella/react-datetime-pickers/master/example/public/images/calendar.png" width="300">
<img alt="time" src="https://raw.githubusercontent.com/mauriziocarella/react-datetime-pickers/master/example/public/images/time.png" width="300">

## Install

```bash
npm install --save react-date-pickers
```
or
```bash
yarn install react-date-pickers
```

## Usage

```jsx
import React, {useState} from 'react';

import DateTimePicker from 'react-datetime-pickers';
import 'react-datetime-pickers/dist/index.css';

export default function Example() {
    const [date, setDate] = useState(new Date());
    
    return (
        <DateTimePicker
            selected={date}
            onChange={setDate}
        />
    );
}
```

## License

MIT © [mauriziocarella](https://github.com/mauriziocarella)
