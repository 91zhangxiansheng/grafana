import { preparePlotData, timeFormatToTemplate } from './utils';
import { FieldType, MutableDataFrame } from '@grafana/data';
import { StackingMode } from './config';

describe('timeFormatToTemplate', () => {
  it.each`
    format           | expected
    ${'HH:mm:ss'}    | ${'{HH}:{mm}:{ss}'}
    ${'HH:mm'}       | ${'{HH}:{mm}'}
    ${'MM/DD HH:mm'} | ${'{MM}/{DD} {HH}:{mm}'}
    ${'MM/DD'}       | ${'{MM}/{DD}'}
    ${'YYYY-MM'}     | ${'{YYYY}-{MM}'}
    ${'YYYY'}        | ${'{YYYY}'}
  `('should convert $format to $expected', ({ format, expected }) => {
    expect(timeFormatToTemplate(format)).toEqual(expected);
  });
});

describe('preparePlotData', () => {
  const df = new MutableDataFrame({
    fields: [
      { name: 'time', type: FieldType.time, values: [9997, 9998, 9999] },
      { name: 'a', values: [-10, 20, 10] },
      { name: 'b', values: [10, 10, 10] },
      { name: 'c', values: [20, 20, 20] },
    ],
  });

  it('creates array from DataFrame', () => {
    expect(preparePlotData(df)).toMatchInlineSnapshot(`
      Array [
        Array [
          9997,
          9998,
          9999,
        ],
        Array [
          -10,
          20,
          10,
        ],
        Array [
          10,
          10,
          10,
        ],
        Array [
          20,
          20,
          20,
        ],
      ]
    `);
  });

  describe('stacking', () => {
    it('none', () => {
      expect(preparePlotData(df, StackingMode.None)).toMatchInlineSnapshot(`
      Array [
        Array [
          9997,
          9998,
          9999,
        ],
        Array [
          -10,
          20,
          10,
        ],
        Array [
          10,
          10,
          10,
        ],
        Array [
          20,
          20,
          20,
        ],
      ]
    `);
    });

    it('standard', () => {
      expect(preparePlotData(df, StackingMode.Standard)).toMatchInlineSnapshot(`
      Array [
        Array [
          9997,
          9998,
          9999,
        ],
        Array [
          -10,
          20,
          10,
        ],
        Array [
          0,
          30,
          20,
        ],
        Array [
          20,
          50,
          40,
        ],
      ]
    `);
    });

    it.skip('percentage', () => {
      expect(preparePlotData(df, StackingMode.Standard)).toMatchInlineSnapshot(`
      Array [
        Array [
          9997,
          9998,
          9999,
        ],
        Array [
          -10,
          20,
          10,
        ],
        Array [
          0,
          30,
          20,
        ],
        Array [
          20,
          50,
          40,
        ],
      ]
    `);
    });
  });
});
