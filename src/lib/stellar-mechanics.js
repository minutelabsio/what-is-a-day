import NR from 'newton-raphson-method'
const Pi2 = Math.PI * 2
export const VERNAL = 79 * Pi2 / 365 // rads
export const PERHELION = 4 * Pi2 / 365 // rads

// to second order in e
// https://en.wikipedia.org/wiki/True_anomaly#From_the_mean_anomaly
function trueAnomalyFromMeanAnomaly( M, e ){
  return M + ( 2 * e * Math.sin(M) ) + ( 5 / 4 ) * e * e * Math.sin( 2 * M )
}

export function euclideanModulo( n, m ) {
	return ( ( n % m ) + m ) % m
}

const NROPTIONS = {
  // verbose: true
}

export function meanAnomalyFromTrue( T, e ){
  let g = Math.sqrt((1 - e)/(1 + e))
  let E = 2 * Math.atan( g * Math.tan( 0.5 * T ) )
  let M = E - e * Math.sin(E)
  if ( M < 0 ){
    M = Pi2 + M
  }
  return M
}

export function trueAnomaly( M, e ){
  let E
  let cosE
  let theta

  if ( e === 0 ){
    return M
  }

  // https://en.wikipedia.org/wiki/Eccentric_anomaly#From_the_mean_anomaly
  const FofE = ( E ) => E - e * Math.sin(E) - M
  // derivative
  const FofEp = ( E ) => 1 - e * Math.cos(E)
  // guess...
  E = trueAnomalyFromMeanAnomaly( M, e )

  // calculate E
  E = NR( FofE, FofEp, E, NROPTIONS )

  cosE = Math.cos( E )
  // calc true anomaly
  theta = Math.acos( (cosE - e) / (1 - e * cosE) )
  if ( E > Math.PI ){
    theta = Pi2 - theta
  }

  // console.log(theta)

  return theta
}

function normalizeAngle( ang, against ){
  let rads = against/Math.PI
  if ( rads <= 0.5 ){
    return ang
  }
  if ( rads <= 1.5 ){
    return ang + Math.PI
  }
  return ang + Pi2
}

function rightAscention( M, e, y, perhelionAngle ){
  let theta = trueAnomaly( M, e )
  let ang = theta + perhelionAngle
  let RA = Math.atan( Math.cos(y) * Math.tan( ang ) )
  // tan is discontinuous... so we make it continuous
  RA = normalizeAngle( RA, ang )
  return RA
}

// mean anomaly (year angle), eccentricity, tilt, perhelion angle
export function calcEOT( M, e, y, perhelionAngle ){
  let eot = M + perhelionAngle - rightAscention( M, e, y, perhelionAngle )
  return eot
}
