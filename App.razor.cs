using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace SprayPatternGeneratorBlazor
{
	public partial class App
	{
		public static Dictionary<int, Random> Randoms = new();
		static int Index = 0;

		[Inject]
		public IJSInProcessRuntime JS { get; set; }

		[JSInvokable("CreateGenerator")]
		public static int CreateGenerator(int seed)
		{
			var gen = new Random(seed);
			Randoms[Index] = gen;
			return Index++;
		}

		[JSInvokable("GetRandomDouble")]
		public static double GetRandomDouble(int index)
		{
			var rand =  Randoms[index];
			return rand.NextDouble();
		}

		[JSInvokable("GetRandomDoubleArray")]
		public static double[] GetRandomDoubleArray(int id, int length)
		{
			var result = new double[length];
			for (var i = 0; i < length; i++)
			{
				result[i] = Randoms[id].NextDouble();
			}
			return result;
		}

		[JSInvokable("Dispose")]
		public static void Dispose(int index)
		{
			Randoms.Remove(index);
		}


		protected override void OnAfterRender(bool firstRender)
		{
			if (firstRender)
			{
				JS.InvokeVoidAsync("Init");
			}
			base.OnAfterRender(firstRender);
		}
	}
}
