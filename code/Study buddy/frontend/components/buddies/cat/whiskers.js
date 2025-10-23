import { SingleWhisker } from "./singleWhisker";

/* 100% manual */

export function Whiskers({buddyDetails}) {
	return (
		<>
                  <SingleWhisker buddyDetails={buddyDetails} x1={0.2} y1={0.66} x2={0.4} y2={0.66} />
                  <SingleWhisker buddyDetails={buddyDetails} x1={0.8} y1={0.66} x2={0.6} y2={0.66} />
                  <SingleWhisker buddyDetails={buddyDetails} x1={0.22} y1={0.56} x2={0.41} y2={0.62} />
                  <SingleWhisker buddyDetails={buddyDetails} x1={0.78} y1={0.56} x2={0.59} y2={0.62} />
                  <SingleWhisker buddyDetails={buddyDetails} x1={0.22} y1={0.76} x2={0.41} y2={0.7} />
                  <SingleWhisker buddyDetails={buddyDetails} x1={0.78} y1={0.76} x2={0.59} y2={0.7} />
		</>
	)
}