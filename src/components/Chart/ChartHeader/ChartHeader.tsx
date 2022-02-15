import { useMemo } from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import { DataPoint, Trend } from '../LineChart/LineChart'
import { AssetPair, ChartGranularity, ChartType, DisplayData, PoolType } from '../shared'
import percentageChange from 'percent-change';
import './ChartHeader.scss'
import classNames from 'classnames';

const horizontalBar = '―';

const formatGranularity = (granularity: ChartGranularity) => (
    <FormattedMessage
        id="ChartHeader.granularity"
        defaultMessage={`{granularity, select, ALL {ALL} D30 {30D} D7 {7D} D3 {3D} H24 {24H} H12 {12H} H1 {1H} other {${horizontalBar}}}`}
        values={{ granularity }}
    />
)

export const ChartHeader = ({
    assetPair,
    poolType,
    displayData,
    referenceData,
    chartType,
    granularity,
    isUserBrowsingGraph,
    availableChartTypes,
    onChartTypeChange,
    availableGranularity,
    onGranularityChange,
    dataTrend
}: {
    assetPair: AssetPair,
    poolType: PoolType,
    displayData: DisplayData,
    referenceData: DisplayData | undefined,
    dataTrend: Trend,
    granularity: ChartGranularity,
    isUserBrowsingGraph: boolean | undefined,
    chartType: ChartType,
    availableChartTypes: ChartType[],
    availableGranularity: ChartGranularity[],
    onChartTypeChange: (chartType: ChartType) => void,
    onGranularityChange: (granularity: ChartGranularity) => void,
}) => {

    const referenceDataPercentageChange = useMemo(() => {
        if (!referenceData?.balance) return 0;
        return percentageChange(referenceData.balance, displayData.balance);
    }, [displayData, referenceData]);

    return (
            <div className="chart-header">
                <div className="flex-container flex-align-space">
                    <div className='flex-container column'>

                        <div className="flex-container">
                            {/* pair symbols */}
                            <div className='chart-header__pair-symbols'>
                                <div>
                                    {`${assetPair.assetA.symbol}`}
                                    <span> / </span>
                                    {assetPair.assetB?.symbol
                                        ? `${assetPair.assetB.symbol}`
                                        // TODO: replace with long dash glyph
                                        : horizontalBar
                                    }
                                </div>
                            </div>

                            {/* TODO: add tooltip after the component is implemented */}
                            <div className="chart-header__type-label">
                                {poolType
                                    ? (
                                        <>
                                            [
                                            <FormattedMessage
                                                id="ChartHeader.poolType.label"
                                                defaultMessage="{poolType, select, XYK {XYK} LBP {LBP} other {-}}"
                                                values={{ poolType }}
                                            />
                                            ]
                                        </>
                                    )
                                    : null
                                }
                            </div>
                        </div>

                        <div className="flex-container">
                            {/* Pair full names */}
                            <div className='text-gray-4 chart-header__pair-full-names'>
                                <div>
                                    {`${assetPair.assetA.fullName} / `}
                                    {assetPair.assetB?.fullName
                                        ? `${assetPair.assetB.fullName}`
                                        : horizontalBar
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='text-end'>
                        <div className='chart-header__data'>
                            
                                <div className='chart-header__data__in-asset'>
                                    {/* TODO: add guards for symbol length */}
                                    {/* TODO: add abbreviations for spot price */}
                                    {displayData.balance
                                        ? (
                                            <>
                                                <FormattedNumber
                                                    value={displayData.balance}
                                                    style='decimal'
                                                    // notation={determineNotation(displayData.balance)}
                                                    minimumFractionDigits={2}
                                                    maximumFractionDigits={2}
                                                />
                                                {' '}
                                            </>
                                        )
                                        : `${horizontalBar} `}

                                    {displayData.asset.symbol}
                                </div>
                                <div className='flex-container flex-align-right flex-wrap chart-header__data__breakdown'>
                             
                                    <div className='text-gray-4'>
                                        {displayData.usdBalance
                                            ? (
                                                <FormattedNumber
                                                    value={displayData.usdBalance}
                                                    style='currency'
                                                    currency='USD'
                                                    // notation={determineNotation(displayData.usdBalance)}
                                                    minimumFractionDigits={2}
                                                    maximumFractionDigits={2}
                                                />
                                            )
                                            : `$ ${horizontalBar}`}
                                    </div>

                                    <div className={classNames({
                                        "text-green-1": dataTrend === Trend.Positive,
                                        "text-gray-1": dataTrend === Trend.Neutral,
                                        "text-red-1": dataTrend === Trend.Negative
                                    })}>
                                        (
                                        {referenceDataPercentageChange >= 0 ? '+' : ''}
                                        <FormattedNumber
                                            style='percent'
                                            minimumFractionDigits={2}
                                            maximumFractionDigits={2}
                                            value={referenceDataPercentageChange}
                                        />
                                        )
                                    </div>
                                    

                                    <div className={"text-gray-4 chart-header__data__breakdown__granularity " + classNames({
                                        "disabled": isUserBrowsingGraph
                                    })}>
                                        <FormattedMessage
                                            id="ChartHeader.granularity.pastIndicator"
                                            defaultMessage="Past"
                                        /> {" "} {formatGranularity(granularity)}
                                        {(() => {
                                            if (!granularity) return;

                                            switch (poolType) {
                                                // This is a *very special* case, when we also want to display
                                                // a price prediction for an LBP PRICE chart
                                                case PoolType.LBP: {
                                                    if (chartType !== ChartType.PRICE) return;
                                                    return <>
                                                        {' + '}
                                                        <FormattedMessage
                                                            id="ChartHeader.granularity.futureIndicator"
                                                            // TODO: do we want to show 'Future' here?
                                                            defaultMessage=" "
                                                        />
                                                        {' '}
                                                        {formatGranularity(granularity)}
                                                    </>
                                                }
                                                default:
                                                    return
                                            }
                                        })()}
                                    </div>
                                </div>
    
                        </div>
                    </div>
                </div>
                <div className="flex-container flex-align-space chart-header__controls">

                    {/* graph selector */}

                    <div className="chart-header__controls__graph-type text-gray-4 text-start">

                        {/* TODO: add translations & granularity enums & on graph type handler */}
                        {/* for now only price chart is available */}
                        {availableChartTypes.map((chartTypeEntry, i) => (
                            <span
                                className={classNames({
                                    "chart-header__controls__graph-type__individual": true,
                                    'active': chartTypeEntry === chartType,
                                    'disabled': chartTypeEntry !== chartType
                                })}
                                key={i}
                                onClick={_ => onChartTypeChange(chartTypeEntry)}
                            >
                                <FormattedMessage
                                    id="ChartHeader.chartType.selector"
                                    defaultMessage="{chartType, select, PRICE {PRICE} VOLUME {VOLUME} WEIGHTS {WEIGHT} other {-}}"
                                    values={{ chartType: chartTypeEntry }}
                                />
                            </span>
                        ))}
                        
                    </div>


                    {/* granularity selector */}

                        <div className="chart-header__controls__granularity text-end text-gray-4">

                            {availableGranularity.map((granularityEntry, i) => {
                                return <span
                                    className={classNames({
                                        "chart-header__controls__granularity__individual": true,
                                        'active': granularityEntry === granularity,
                                    })}
                                    onClick={_ => onGranularityChange(granularityEntry)}
                                    key={i}
                                >
                                    {formatGranularity(granularityEntry)}
                                </span>
                            })}

                        </div>


                </div>
            </div>
    )
}