import NR from 'newton-raphson-method'
const Pi2 = Math.PI * 2
// const vernal = 79 + 17/24
// const perihelion = 3 + 14.5/24

// to second order in e
// https://en.wikipedia.org/wiki/True_anomaly#From_the_mean_anomaly
function trueAnomalyFromMeanAnomaly( M, e ){
  return M + ( 2 * e * Math.sin(M) ) + ( 5 / 4 ) * e * e * Math.sin( 2 * M )
}

function trueAnomaly( M, e ){
  let E
  let cosE
  let theta

  if ( e === 0 ){
    return M
  }

  // https://en.wikipedia.org/wiki/Eccentric_anomaly#From_the_mean_anomaly
  const FofE = ( E ) => E - e * Math.sin(E) - M
  // derivative
  const FofEp = ( E ) => - e * Math.cos(E)
  // guess...
  E = M + e * Math.sin( M ) / ( 1 - e * Math.cos( M ) )

  // calculate E
  E = NR( FofE, FofEp, E )

  cosE = Math.cos( E )
  // calc true anomaly
  theta = Math.acos( (cosE - e) / (1 - e * cosE) )
  if ( E > Math.PI ){
    theta = Pi2 - theta
  }

  return theta
}

function rightAscention( M, e, y, perhelionAngle ){
  let theta = trueAnomaly( M, e )
  let ang = theta + perhelionAngle
  let RA = Math.atan( Math.cos(y) * Math.tan( ang ) )
  // tan is discontinuous... so we make it continuous
  RA += Math.floor(ang / Math.PI + 0.5) * Math.PI
  return RA
}

// mean anomaly (year angle), eccentricity, tilt, perhelion angle
export function calcEOT( M, e, y, perhelionAngle ){
  return M + perhelionAngle - rightAscention( M, e, y, perhelionAngle )
}
