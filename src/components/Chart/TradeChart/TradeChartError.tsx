import './TradeChartError.scss';

export enum TradeChartErrorType {
    InvalidPair = 'InvalidPair',
    Unexpected = 'Unexpected'
}
export const TradeChartError = ({
    type
}: {
    type: TradeChartErrorType
}) => {
    return <div className="trade-chart-error flex-container column">
        {(() => {
            switch (type) {
                case TradeChartErrorType.InvalidPair:
                    return <div className='row'>
                        <div className='large'>Graph unavailable, please select <br/> a valid asset pair</div>
                        <div className="small">You can read our FAQ to learn more about valid asset pairs.</div>
                    </div>
                default: 
                    return <div className='row'>
                        <div className='large'>Oops, something went wrong.<br/>Please try again.</div>
                        <div className="small">If this problem persists, please report an issue or talk to our support team.</div>
                    </div>
            }
        })()}
    </div>
}